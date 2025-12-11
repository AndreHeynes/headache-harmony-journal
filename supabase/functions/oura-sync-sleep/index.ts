import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const OURA_CLIENT_ID = Deno.env.get('OURA_CLIENT_ID')!;
const OURA_CLIENT_SECRET = Deno.env.get('OURA_CLIENT_SECRET')!;

// Restricted CORS origins
const ALLOWED_ORIGINS = [
  'https://vbutzblgbexuwedzayjv.lovable.app',
  'https://lovable.dev',
  'http://localhost:5173',
  'http://localhost:3000',
];

function getCorsHeaders(requestOrigin?: string | null): Record<string, string> {
  const origin = requestOrigin && ALLOWED_ORIGINS.some(allowed => 
    requestOrigin === allowed || requestOrigin.endsWith('.lovable.app')
  ) ? requestOrigin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
}

// Rate limiter
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const key = `sync:${userId}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 60000 });
    return { allowed: true };
  }
  
  if (entry.count >= 10) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetTime - now) / 1000) };
  }
  
  entry.count++;
  return { allowed: true };
}

// Token encryption/decryption
function decryptToken(encryptedToken: string): string {
  if (!encryptedToken || !SUPABASE_SERVICE_ROLE_KEY) return encryptedToken;
  
  try {
    const encrypted = new Uint8Array(
      atob(encryptedToken).split('').map(c => c.charCodeAt(0))
    );
    const keyBytes = new TextEncoder().encode(SUPABASE_SERVICE_ROLE_KEY);
    const decrypted = new Uint8Array(encrypted.length);
    
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length];
    }
    
    return new TextDecoder().decode(decrypted);
  } catch {
    return encryptedToken; // Fallback for unencrypted tokens
  }
}

function encryptToken(token: string): string {
  if (!token || !SUPABASE_SERVICE_ROLE_KEY) return token;
  
  const keyBytes = new TextEncoder().encode(SUPABASE_SERVICE_ROLE_KEY);
  const tokenBytes = new TextEncoder().encode(token);
  const encrypted = new Uint8Array(tokenBytes.length);
  
  for (let i = 0; i < tokenBytes.length; i++) {
    encrypted[i] = tokenBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  
  return btoa(String.fromCharCode(...encrypted));
}

serve(async (req) => {
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, days = 7 } = await req.json();

    if (!user_id) {
      throw new Error('user_id is required');
    }

    // Rate limit check
    const rateLimit = checkRateLimit(user_id);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', retryAfter: rateLimit.retryAfter }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': String(rateLimit.retryAfter) } }
      );
    }

    console.log(`Syncing Oura sleep data for user ${user_id}, last ${days} days`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

    // Decrypt tokens
    let accessToken = decryptToken(connection.access_token_encrypted);
    const refreshToken = decryptToken(connection.refresh_token_encrypted);
    const tokenExpiresAt = new Date(connection.token_expires_at);

    // Check if token needs refresh (buffer of 5 minutes)
    if (tokenExpiresAt <= new Date(Date.now() + 5 * 60 * 1000)) {
      console.log('Token expired or expiring soon, refreshing...');
      
      const refreshResponse = await fetch('https://api.ouraring.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: OURA_CLIENT_ID,
          client_secret: OURA_CLIENT_SECRET,
        }),
      });

      if (!refreshResponse.ok) {
        const errorText = await refreshResponse.text();
        console.error('Token refresh failed:', errorText);
        throw new Error('Failed to refresh Oura token');
      }

      const tokenData = await refreshResponse.json();
      accessToken = tokenData.access_token;

      // Update with ENCRYPTED tokens
      const newExpiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));
      await supabase
        .from('health_tracker_connections')
        .update({
          access_token_encrypted: encryptToken(tokenData.access_token),
          refresh_token_encrypted: encryptToken(tokenData.refresh_token),
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
      headers: { 'Authorization': `Bearer ${accessToken}` },
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
          light: null,
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
      { status: 400, headers: { ...getCorsHeaders(null), 'Content-Type': 'application/json' } }
    );
  }
});
