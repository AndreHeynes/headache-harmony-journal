import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FITBIT_CLIENT_ID = Deno.env.get('FITBIT_CLIENT_ID');
const FITBIT_CLIENT_SECRET = Deno.env.get('FITBIT_CLIENT_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const FITBIT_TOKEN_URL = 'https://api.fitbit.com/oauth2/token';

// Simple XOR encryption for tokens
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

// Standardized OAuth result HTML
function generateOAuthResultHtml(status: 'success' | 'error', message: string): string {
  const bgColor = status === 'success' ? '#10B981' : '#EF4444';
  const icon = status === 'success' 
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

  return `<!DOCTYPE html>
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
      padding: 2.5rem;
      max-width: 420px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .icon { color: ${bgColor}; margin-bottom: 1.5rem; display: flex; justify-content: center; }
    .provider-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; }
    p { color: rgba(255,255,255,0.7); margin-bottom: 1.5rem; line-height: 1.5; }
    .btn {
      background: ${bgColor};
      color: white;
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }
    .btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .countdown { margin-top: 1rem; font-size: 0.875rem; color: rgba(255,255,255,0.5); }
  </style>
</head>
<body>
  <div class="container">
    <div class="provider-badge">Fitbit</div>
    <div class="icon">${icon}</div>
    <h1>${status === 'success' ? 'Connected!' : 'Connection Failed'}</h1>
    <p>${message}</p>
    <button class="btn" onclick="closeAndRefresh()">Close Window</button>
    ${status === 'success' ? `<p class="countdown">Auto-closing in <span id="timer">3</span>s...</p>` : ''}
  </div>
  <script>
    function closeAndRefresh() {
      if (window.opener) {
        window.opener.postMessage({ type: 'oauth-complete', status: '${status}', provider: 'fitbit' }, '*');
        window.opener.location.reload();
      }
      window.close();
    }
    ${status === 'success' ? `
    let timeLeft = 3;
    const timerEl = document.getElementById('timer');
    const countdown = setInterval(() => {
      timeLeft--;
      if (timerEl) timerEl.textContent = timeLeft;
      if (timeLeft <= 0) { clearInterval(countdown); closeAndRefresh(); }
    }, 1000);` : ''}
  </script>
</body>
</html>`;
}

serve(async (req) => {
  // No CORS for callback - it's a redirect from Fitbit
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    console.log('Fitbit OAuth callback received:', { code: !!code, state, error });

    if (error) {
      console.error('Fitbit OAuth error:', error);
      return new Response(
        generateOAuthResultHtml('error', 'Authorization was denied or an error occurred.'),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (!code || !state) {
      return new Response(
        generateOAuthResultHtml('error', 'Missing authorization code or state.'),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (!FITBIT_CLIENT_ID || !FITBIT_CLIENT_SECRET) {
      return new Response(
        generateOAuthResultHtml('error', 'Server configuration error. Please contact support.'),
        { headers: { 'Content-Type': 'text/html' } }
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

    if (!tokenResponse.ok) {
      console.error('Fitbit token error:', tokenData);
      return new Response(
        generateOAuthResultHtml('error', 'Failed to exchange authorization code.'),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    const { access_token, refresh_token, expires_in, scope } = tokenData;
    console.log('Fitbit token obtained, scopes:', scope);

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const tokenExpiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    // Store ENCRYPTED tokens
    const { error: dbError } = await supabase
      .from('health_tracker_connections')
      .upsert({
        user_id: state,
        provider: 'fitbit',
        is_connected: true,
        access_token_encrypted: encryptToken(access_token),
        refresh_token_encrypted: encryptToken(refresh_token),
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
        generateOAuthResultHtml('error', 'Failed to save connection. Please try again.'),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    console.log('Fitbit connection saved successfully for user:', state);

    return new Response(
      generateOAuthResultHtml('success', 'Fitbit connected successfully! Your sleep data will now sync automatically.'),
      { headers: { 'Content-Type': 'text/html' } }
    );

  } catch (err) {
    console.error('Fitbit OAuth callback error:', err);
    return new Response(
      generateOAuthResultHtml('error', 'An unexpected error occurred.'),
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
});
