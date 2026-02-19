import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FITBIT_CLIENT_ID = Deno.env.get('FITBIT_CLIENT_ID')!;
const FITBIT_CLIENT_SECRET = Deno.env.get('FITBIT_CLIENT_SECRET')!;

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

// AES-256-GCM encryption/decryption for tokens
async function deriveKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SUPABASE_SERVICE_ROLE_KEY),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  const salt = encoder.encode('lovable-token-encryption-salt-v1');
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function decryptToken(encryptedToken: string): Promise<string> {
  if (!encryptedToken || !SUPABASE_SERVICE_ROLE_KEY) return encryptedToken;
  
  try {
    const combined = new Uint8Array(
      atob(encryptedToken).split('').map(c => c.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    
    const key = await deriveKey();
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    
    return new TextDecoder().decode(decrypted);
  } catch {
    // Try legacy XOR decryption for backward compatibility
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
      return encryptedToken;
    }
  }
}

async function encryptToken(token: string): Promise<string> {
  if (!token || !SUPABASE_SERVICE_ROLE_KEY) return token;
  
  try {
    const encoder = new TextEncoder();
    const key = await deriveKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(token)
    );
    
    const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch {
    return token;
  }
}

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
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.error('Failed to fetch sleep data:', await response.text());
    return null;
  }

  const data = await response.json();
  return data.sleep || [];
}

serve(async (req) => {
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract user_id from JWT instead of request body
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const user_id = user.id;
    const body = await req.json().catch(() => ({}));
    const days = body.days ?? 7;

    // Rate limit check
    const rateLimit = checkRateLimit(user_id);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', retryAfter: rateLimit.retryAfter }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': String(rateLimit.retryAfter) } }
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

    // Decrypt tokens
    let accessToken = await decryptToken(connection.access_token_encrypted);
    let refreshToken = await decryptToken(connection.refresh_token_encrypted);

    // Check if token is expired and refresh if needed
    const tokenExpiry = new Date(connection.token_expires_at);
    if (tokenExpiry < new Date()) {
      console.log('Token expired, refreshing...');
      const newTokens = await refreshAccessToken(refreshToken);
      
      if (!newTokens) {
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

      // Update with ENCRYPTED tokens
      await supabase
        .from('health_tracker_connections')
        .update({
          access_token_encrypted: await encryptToken(newTokens.access_token),
          refresh_token_encrypted: await encryptToken(newTokens.refresh_token),
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
      { status: 500, headers: { ...getCorsHeaders(null), 'Content-Type': 'application/json' } }
    );
  }
});
