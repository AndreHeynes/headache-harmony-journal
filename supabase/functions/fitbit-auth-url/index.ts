import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FITBIT_CLIENT_ID = Deno.env.get('FITBIT_CLIENT_ID');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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

// Simple rate limiter
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const key = `auth:${userId}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 60000 });
    return { allowed: true };
  }
  
  if (entry.count >= 5) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetTime - now) / 1000) };
  }
  
  entry.count++;
  return { allowed: true };
}

serve(async (req) => {
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract user_id from JWT token (secure method)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit check
    const rateLimit = checkRateLimit(user.id);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', retryAfter: rateLimit.retryAfter }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': String(rateLimit.retryAfter) } }
      );
    }

    if (!FITBIT_CLIENT_ID) {
      console.error('FITBIT_CLIENT_ID not configured');
      return new Response(
        JSON.stringify({ error: 'Fitbit integration not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate CSRF token for OAuth state validation
    const csrfToken = crypto.randomUUID();
    
    // Create state with user_id and CSRF token
    const stateData = {
      user_id: user.id,
      csrf_token: csrfToken,
    };
    const state = btoa(JSON.stringify(stateData));
    
    // Store CSRF token in database with 5-minute expiry
    const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    const { error: insertError } = await supabaseAdmin
      .from('oauth_state_tokens')
      .insert({
        token: csrfToken,
        user_id: user.id,
        provider: 'fitbit',
        expires_at: expiresAt.toISOString(),
      });
    
    if (insertError) {
      console.error('Error storing OAuth state token:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to initialize OAuth flow' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const redirectUri = `${SUPABASE_URL}/functions/v1/fitbit-oauth-callback`;
    const scopes = ['sleep', 'profile'].join(' ');
    
    // Use encoded state with CSRF token
    const authUrl = `https://www.fitbit.com/oauth2/authorize?` +
      `response_type=code&` +
      `client_id=${FITBIT_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=${encodeURIComponent(state)}`;

    console.log('Generated Fitbit auth URL for user:', user.id, 'with CSRF protection');

    return new Response(
      JSON.stringify({ auth_url: authUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Error generating Fitbit auth URL:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to generate authorization URL' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
