import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FITBIT_CLIENT_ID = Deno.env.get('FITBIT_CLIENT_ID');
const FITBIT_CLIENT_SECRET = Deno.env.get('FITBIT_CLIENT_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Fitbit OAuth endpoints
const FITBIT_TOKEN_URL = 'https://api.fitbit.com/oauth2/token';
const FITBIT_USER_URL = 'https://api.fitbit.com/1/user/-/profile.json';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state'); // Contains user_id
    const error = url.searchParams.get('error');

    console.log('Fitbit OAuth callback received:', { code: !!code, state, error });

    // Handle OAuth errors
    if (error) {
      console.error('Fitbit OAuth error:', error);
      return new Response(
        generateHTML('error', 'Authorization was denied or an error occurred.'),
        { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
      );
    }

    if (!code || !state) {
      console.error('Missing code or state parameter');
      return new Response(
        generateHTML('error', 'Missing authorization code or state.'),
        { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
      );
    }

    if (!FITBIT_CLIENT_ID || !FITBIT_CLIENT_SECRET) {
      console.error('Missing Fitbit credentials');
      return new Response(
        generateHTML('error', 'Server configuration error. Please contact support.'),
        { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
      );
    }

    // Exchange authorization code for access token
    const redirectUri = `${SUPABASE_URL}/functions/v1/fitbit-oauth-callback`;
    const tokenResponse = await fetch(FITBIT_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      console.error('Fitbit token error:', tokenData);
      return new Response(
        generateHTML('error', 'Failed to exchange authorization code.'),
        { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
      );
    }

    const { access_token, refresh_token, expires_in, scope } = tokenData;
    console.log('Fitbit token obtained, scopes:', scope);

    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Calculate token expiry
    const tokenExpiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    // Update or insert health tracker connection
    const { error: dbError } = await supabase
      .from('health_tracker_connections')
      .upsert({
        user_id: state,
        provider: 'fitbit',
        is_connected: true,
        access_token_encrypted: access_token, // In production, encrypt this
        refresh_token_encrypted: refresh_token, // In production, encrypt this
        token_expires_at: tokenExpiresAt,
        scopes: scope.split(' '),
        sync_enabled: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,provider',
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        generateHTML('error', 'Failed to save connection. Please try again.'),
        { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
      );
    }

    console.log('Fitbit connection saved successfully for user:', state);

    // Trigger initial sync (optional - could be done via a separate function)
    // await syncFitbitData(supabase, state, access_token);

    return new Response(
      generateHTML('success', 'Fitbit connected successfully! You can close this window.'),
      { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
    );

  } catch (err) {
    console.error('Fitbit OAuth callback error:', err);
    return new Response(
      generateHTML('error', 'An unexpected error occurred.'),
      { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
    );
  }
});

function generateHTML(status: 'success' | 'error', message: string): string {
  const bgColor = status === 'success' ? '#10B981' : '#EF4444';
  const icon = status === 'success' 
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fitbit Connection</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 400px;
    }
    .icon {
      color: ${bgColor};
      margin-bottom: 1.5rem;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    p {
      color: rgba(255,255,255,0.7);
      margin-bottom: 1.5rem;
    }
    .btn {
      background: ${bgColor};
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">${icon}</div>
    <h1>${status === 'success' ? 'Connected!' : 'Connection Failed'}</h1>
    <p>${message}</p>
    <button class="btn" onclick="window.close(); window.opener?.location?.reload();">
      Close Window
    </button>
  </div>
  <script>
    // Auto-close after 3 seconds on success
    ${status === 'success' ? 'setTimeout(() => { window.close(); window.opener?.location?.reload(); }, 3000);' : ''}
  </script>
</body>
</html>
  `;
}
