import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FITBIT_CLIENT_ID = Deno.env.get('FITBIT_CLIENT_ID');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!FITBIT_CLIENT_ID) {
      console.error('FITBIT_CLIENT_ID not configured');
      return new Response(
        JSON.stringify({ error: 'Fitbit integration not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const redirectUri = `${SUPABASE_URL}/functions/v1/fitbit-oauth-callback`;
    const scopes = ['sleep', 'profile'].join(' ');
    
    // Use user_id as state parameter to identify the user in the callback
    const authUrl = `https://www.fitbit.com/oauth2/authorize?` +
      `response_type=code&` +
      `client_id=${FITBIT_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=${user_id}`;

    console.log('Generated Fitbit auth URL for user:', user_id);

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
