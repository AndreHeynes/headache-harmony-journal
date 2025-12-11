import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, days = 7 } = await req.json();

    if (!user_id) {
      throw new Error('user_id is required');
    }

    console.log(`Syncing Oura sleep data for user ${user_id}, last ${days} days`);

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const OURA_CLIENT_ID = Deno.env.get('OURA_CLIENT_ID');
    const OURA_CLIENT_SECRET = Deno.env.get('OURA_CLIENT_SECRET');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get the user's Oura connection
    const { data: connection, error: connError } = await supabase
      .from('health_tracker_connections')
      .select('*')
      .eq('user_id', user_id)
      .eq('provider', 'oura')
      .single();

    if (connError || !connection) {
      console.error('No Oura connection found:', connError);
      throw new Error('No Oura connection found');
    }

    let accessToken = connection.access_token_encrypted;
    const tokenExpiresAt = new Date(connection.token_expires_at);

    // Check if token needs refresh (buffer of 5 minutes)
    if (tokenExpiresAt <= new Date(Date.now() + 5 * 60 * 1000)) {
      console.log('Token expired or expiring soon, refreshing...');
      
      const refreshResponse = await fetch('https://api.ouraring.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: connection.refresh_token_encrypted,
          client_id: OURA_CLIENT_ID!,
          client_secret: OURA_CLIENT_SECRET!,
        }),
      });

      if (!refreshResponse.ok) {
        const errorText = await refreshResponse.text();
        console.error('Token refresh failed:', errorText);
        throw new Error('Failed to refresh Oura token');
      }

      const tokenData = await refreshResponse.json();
      accessToken = tokenData.access_token;

      // Update stored tokens
      const newExpiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));
      await supabase
        .from('health_tracker_connections')
        .update({
          access_token_encrypted: tokenData.access_token,
          refresh_token_encrypted: tokenData.refresh_token,
          token_expires_at: newExpiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', connection.id);

      console.log('Token refreshed successfully');
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // Fetch sleep data from Oura API v2
    const sleepUrl = new URL('https://api.ouraring.com/v2/usercollection/daily_sleep');
    sleepUrl.searchParams.set('start_date', formatDate(startDate));
    sleepUrl.searchParams.set('end_date', formatDate(endDate));

    console.log('Fetching Oura sleep data:', sleepUrl.toString());

    const sleepResponse = await fetch(sleepUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!sleepResponse.ok) {
      const errorText = await sleepResponse.text();
      console.error('Oura API error:', sleepResponse.status, errorText);
      throw new Error(`Oura API error: ${sleepResponse.status}`);
    }

    const sleepData = await sleepResponse.json();
    console.log(`Received ${sleepData.data?.length || 0} sleep records`);

    const syncedDates: string[] = [];

    // Process and store sleep data
    for (const record of sleepData.data || []) {
      const sleepDate = record.day;
      
      // Map Oura data to unified schema
      const healthData = {
        user_id,
        date: sleepDate,
        data_type: 'sleep',
        source: 'oura',
        sleep_duration_minutes: record.contributors?.total_sleep 
          ? Math.round(record.contributors.total_sleep / 60) 
          : null,
        sleep_quality_score: record.score || null,
        sleep_stages: {
          deep: record.contributors?.deep_sleep || null,
          light: record.contributors?.rem_sleep ? null : null, // Oura uses different metrics
          rem: record.contributors?.rem_sleep || null,
          awake: null,
          efficiency: record.contributors?.efficiency || null,
          latency: record.contributors?.latency || null,
          timing: record.contributors?.timing || null,
          restfulness: record.contributors?.restfulness || null,
        },
        raw_data: record,
        synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Upsert using the unique constraint
      const { error: upsertError } = await supabase
        .from('unified_health_data')
        .upsert(healthData, {
          onConflict: 'user_id,date,data_type,source',
        });

      if (upsertError) {
        console.error('Error upserting sleep data:', upsertError);
      } else {
        syncedDates.push(sleepDate);
      }
    }

    // Update last_sync_at
    await supabase
      .from('health_tracker_connections')
      .update({ 
        last_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', connection.id);

    console.log(`Sync complete. Synced ${syncedDates.length} days of data.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced_dates: syncedDates,
        total_records: sleepData.data?.length || 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Oura sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
