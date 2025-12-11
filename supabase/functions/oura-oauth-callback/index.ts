import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state'); // This is the user_id
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    console.log('Oura OAuth callback received:', { code: !!code, state, error });

    if (error) {
      console.error('Oura OAuth error:', error, errorDescription);
      return new Response(
        generateHtmlResponse(false, `Authorization failed: ${errorDescription || error}`),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (!code || !state) {
      return new Response(
        generateHtmlResponse(false, 'Missing authorization code or state'),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    const OURA_CLIENT_ID = Deno.env.get('OURA_CLIENT_ID');
    const OURA_CLIENT_SECRET = Deno.env.get('OURA_CLIENT_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!OURA_CLIENT_ID || !OURA_CLIENT_SECRET) {
      throw new Error('Oura credentials not configured');
    }

    const redirectUri = `${SUPABASE_URL}/functions/v1/oura-oauth-callback`;

    // Exchange authorization code for tokens
    console.log('Exchanging code for tokens...');
    const tokenResponse = await fetch('https://api.ouraring.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
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

    // Calculate token expiry (Oura tokens typically expire in 86400 seconds / 24 hours)
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));

    // Store connection in database using service role
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Check for existing connection and update or insert
    const { data: existing } = await supabase
      .from('health_tracker_connections')
      .select('id')
      .eq('user_id', state)
      .eq('provider', 'oura')
      .single();

    const connectionData = {
      user_id: state,
      provider: 'oura',
      access_token_encrypted: tokenData.access_token,
      refresh_token_encrypted: tokenData.refresh_token,
      token_expires_at: expiresAt.toISOString(),
      is_connected: true,
      sync_enabled: true,
      scopes: ['daily', 'personal'],
      updated_at: new Date().toISOString(),
    };

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
      generateHtmlResponse(true, 'Oura Ring connected successfully!'),
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    console.error('Oura OAuth callback error:', error);
    return new Response(
      generateHtmlResponse(false, `Connection failed: ${error.message}`),
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
});

function generateHtmlResponse(success: boolean, message: string): string {
  const color = success ? '#10b981' : '#ef4444';
  const icon = success ? '✓' : '✕';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Oura Connection</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
        }
        .container {
          text-align: center;
          padding: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          max-width: 400px;
        }
        .icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 40px;
        }
        h1 { margin: 0 0 10px; font-size: 24px; }
        p { margin: 0; opacity: 0.8; }
        .close-note {
          margin-top: 20px;
          font-size: 14px;
          opacity: 0.6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">${icon}</div>
        <h1>${success ? 'Success!' : 'Error'}</h1>
        <p>${message}</p>
        <p class="close-note">You can close this window now.</p>
      </div>
      <script>
        setTimeout(() => { window.close(); }, 3000);
      </script>
    </body>
    </html>
  `;
}
