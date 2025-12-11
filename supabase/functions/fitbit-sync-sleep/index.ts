import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FITBIT_CLIENT_ID = Deno.env.get('FITBIT_CLIENT_ID')!;
const FITBIT_CLIENT_SECRET = Deno.env.get('FITBIT_CLIENT_SECRET')!;

interface FitbitSleepLog {
  dateOfSleep: string;
  duration: number;
  efficiency: number;
  startTime: string;
  endTime: string;
  levels?: {
    summary?: {
      deep?: { minutes: number };
      light?: { minutes: number };
      rem?: { minutes: number };
      wake?: { minutes: number };
    };
  };
}

async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string; expires_in: number } | null> {
  const credentials = btoa(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`);
  
  const response = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    console.error('Failed to refresh token:', await response.text());
    return null;
  }

  return await response.json();
}

async function fetchSleepData(accessToken: string, date: string): Promise<FitbitSleepLog[] | null> {
  const response = await fetch(`https://api.fitbit.com/1.2/user/-/sleep/date/${date}.json`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch sleep data:', await response.text());
    return null;
  }

  const data = await response.json();
  return data.sleep || [];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, days = 7 } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get Fitbit connection for user
    const { data: connection, error: connError } = await supabase
      .from('health_tracker_connections')
      .select('*')
      .eq('user_id', user_id)
      .eq('provider', 'fitbit')
      .eq('is_connected', true)
      .single();

    if (connError || !connection) {
      console.error('No Fitbit connection found:', connError);
      return new Response(
        JSON.stringify({ error: 'No active Fitbit connection found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let accessToken = connection.access_token_encrypted;
    let refreshToken = connection.refresh_token_encrypted;

    // Check if token is expired and refresh if needed
    const tokenExpiry = new Date(connection.token_expires_at);
    if (tokenExpiry < new Date()) {
      console.log('Token expired, refreshing...');
      const newTokens = await refreshAccessToken(refreshToken);
      
      if (!newTokens) {
        // Mark connection as disconnected
        await supabase
          .from('health_tracker_connections')
          .update({ is_connected: false })
          .eq('id', connection.id);

        return new Response(
          JSON.stringify({ error: 'Failed to refresh token. Please reconnect Fitbit.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      accessToken = newTokens.access_token;
      refreshToken = newTokens.refresh_token;

      // Update tokens in database
      await supabase
        .from('health_tracker_connections')
        .update({
          access_token_encrypted: newTokens.access_token,
          refresh_token_encrypted: newTokens.refresh_token,
          token_expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', connection.id);
    }

    // Fetch sleep data for the last N days
    const syncedDates: string[] = [];
    const errors: string[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const sleepLogs = await fetchSleepData(accessToken, dateStr);
      
      if (!sleepLogs) {
        errors.push(`Failed to fetch data for ${dateStr}`);
        continue;
      }

      for (const log of sleepLogs) {
        const sleepQualityScore = Math.round(log.efficiency);
        const sleepDurationMinutes = Math.round(log.duration / 60000);

        const sleepStages = log.levels?.summary ? {
          deep: log.levels.summary.deep?.minutes || 0,
          light: log.levels.summary.light?.minutes || 0,
          rem: log.levels.summary.rem?.minutes || 0,
          wake: log.levels.summary.wake?.minutes || 0,
        } : null;

        // Upsert sleep data
        const { error: upsertError } = await supabase
          .from('unified_health_data')
          .upsert({
            user_id,
            date: log.dateOfSleep,
            data_type: 'sleep',
            source: 'fitbit',
            sleep_duration_minutes: sleepDurationMinutes,
            sleep_quality_score: sleepQualityScore,
            sleep_stages: sleepStages,
            bed_time: log.startTime,
            wake_time: log.endTime,
            raw_data: log,
            synced_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,date,data_type,source',
          });

        if (upsertError) {
          console.error('Error upserting sleep data:', upsertError);
          errors.push(`Failed to save data for ${log.dateOfSleep}`);
        } else {
          syncedDates.push(log.dateOfSleep);
        }
      }
    }

    // Update last sync timestamp
    await supabase
      .from('health_tracker_connections')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', connection.id);

    console.log(`Synced ${syncedDates.length} sleep records for user ${user_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced_dates: [...new Set(syncedDates)],
        errors: errors.length > 0 ? errors : undefined 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Error syncing Fitbit sleep data:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to sync sleep data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
