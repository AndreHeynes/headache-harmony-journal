import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OURA_CLIENT_ID = Deno.env.get('OURA_CLIENT_ID');
const OURA_CLIENT_SECRET = Deno.env.get('OURA_CLIENT_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// AES-256-GCM encryption for tokens
async function deriveKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SUPABASE_SERVICE_ROLE_KEY || ''),
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
  } catch (error) {
    console.error('Token encryption failed:', error);
    return token;
  }
}

// Standardized OAuth result HTML with page refresh
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
  <title>Oura Ring Connection</title>
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
    <div class="provider-badge">Oura Ring</div>
    <div class="icon">${icon}</div>
    <h1>${status === 'success' ? 'Connected!' : 'Connection Failed'}</h1>
    <p>${message}</p>
    <button class="btn" onclick="closeAndRefresh()">Close Window</button>
    ${status === 'success' ? `<p class="countdown">Auto-closing in <span id="timer">3</span>s...</p>` : ''}
  </div>
  <script>
    function closeAndRefresh() {
      if (window.opener) {
        window.opener.postMessage({ type: 'oauth-complete', status: '${status}', provider: 'oura' }, '*');
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
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    console.log('Oura OAuth callback received:', { code: !!code, state, error });

    if (error) {
      console.error('Oura OAuth error:', error, errorDescription);
      return new Response(
        generateOAuthResultHtml('error', `Authorization failed: ${errorDescription || error}`),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (!code || !state) {
      return new Response(
        generateOAuthResultHtml('error', 'Missing authorization code or state'),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (!OURA_CLIENT_ID || !OURA_CLIENT_SECRET) {
      throw new Error('Oura credentials not configured');
    }

    const redirectUri = `${SUPABASE_URL}/functions/v1/oura-oauth-callback`;

    // Exchange authorization code for tokens
    console.log('Exchanging code for tokens...');
    const tokenResponse = await fetch('https://api.ouraring.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: OURA_CLIENT_ID,
        client_secret: OURA_CLIENT_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      throw new Error(`Token exchange failed: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token exchange successful, expires_in:', tokenData.expires_in);

    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Store ENCRYPTED tokens using AES-GCM
    const connectionData = {
      user_id: state,
      provider: 'oura',
      access_token_encrypted: await encryptToken(tokenData.access_token),
      refresh_token_encrypted: await encryptToken(tokenData.refresh_token),
      token_expires_at: expiresAt.toISOString(),
      is_connected: true,
      sync_enabled: true,
      scopes: ['daily', 'personal'],
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from('health_tracker_connections')
      .select('id')
      .eq('user_id', state)
      .eq('provider', 'oura')
      .single();

    if (existing) {
      const { error: updateError } = await supabase
        .from('health_tracker_connections')
        .update(connectionData)
        .eq('id', existing.id);

      if (updateError) {
        console.error('Error updating connection:', updateError);
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('health_tracker_connections')
        .insert(connectionData);

      if (insertError) {
        console.error('Error inserting connection:', insertError);
        throw insertError;
      }
    }

    console.log('Oura connection saved successfully for user:', state);

    return new Response(
      generateOAuthResultHtml('success', 'Oura Ring connected successfully! Your sleep data will now sync automatically.'),
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    console.error('Oura OAuth callback error:', error);
    return new Response(
      generateOAuthResultHtml('error', `Connection failed: ${error.message}`),
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
});
