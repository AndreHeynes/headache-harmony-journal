import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('[send-beta-magic-link] Edge function loaded');

// Verify beta access with landing page
async function verifyBetaAccess(email: string, requestId: string): Promise<{ valid: boolean; error?: string }> {
  const landingPageUrl = Deno.env.get('LANDING_PAGE_SUPABASE_URL');
  
  if (!landingPageUrl) {
    console.error(`[${requestId}] LANDING_PAGE_SUPABASE_URL not configured`);
    return { valid: false, error: 'Beta validation not configured' };
  }

  try {
    // Query the landing page's beta_signups table to verify access
    const response = await fetch(
      `${landingPageUrl}/rest/v1/beta_signups?email=eq.${encodeURIComponent(email.toLowerCase())}&select=email,product,status`,
      {
        headers: {
          'apikey': Deno.env.get('LANDING_PAGE_ANON_KEY') || '',
          'Authorization': `Bearer ${Deno.env.get('LANDING_PAGE_ANON_KEY') || ''}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`[${requestId}] Landing page query failed:`, response.status);
      return { valid: false, error: 'Failed to verify beta access' };
    }

    const signups = await response.json();
    console.log(`[${requestId}] Beta signup lookup result:`, signups);

    if (!signups || signups.length === 0) {
      console.log(`[${requestId}] No beta signup found for: ${email}`);
      return { valid: false, error: 'No beta access found for this email' };
    }

    const signup = signups[0];
    
    // Check if product is valid (app or program)
    if (signup.product !== 'app' && signup.product !== 'program') {
      console.log(`[${requestId}] Invalid product for beta access: ${signup.product}`);
      return { valid: false, error: 'This email is not registered for app beta access' };
    }

    // Optionally check status if the landing page tracks it
    if (signup.status && signup.status === 'revoked') {
      console.log(`[${requestId}] Beta access revoked for: ${email}`);
      return { valid: false, error: 'Beta access has been revoked' };
    }

    console.log(`[${requestId}] Beta access verified for: ${email}`);
    return { valid: true };
  } catch (error) {
    console.error(`[${requestId}] Error verifying beta access:`, error);
    return { valid: false, error: 'Failed to verify beta access' };
  }
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID().slice(0, 8);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] Processing magic link request for: ${email}`);

    // Step 1: Verify beta access with landing page FIRST
    const betaCheck = await verifyBetaAccess(email, requestId);
    
    if (!betaCheck.valid) {
      console.log(`[${requestId}] Beta access check failed: ${betaCheck.error}`);
      // Return generic message for security (don't reveal if email exists)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'If you have a beta account, you will receive an email shortly.' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Check if user exists in this app's auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error(`[${requestId}] Error listing users:`, listError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to verify user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const existingUser = existingUsers.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!existingUser) {
      console.log(`[${requestId}] User not found in app auth: ${email}`);
      // Don't reveal if user exists or not for security
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'If you have a beta account, you will receive an email shortly.' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] User found and beta access verified, generating magic link`);

    // Generate magic link for the user
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (linkError) {
      console.error(`[${requestId}] Error generating magic link:`, linkError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to generate sign-in link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use Supabase's built-in email to send the magic link
    const { error: signInError } = await supabaseAdmin.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false, // Don't create new users via magic link
      }
    });

    if (signInError) {
      console.error(`[${requestId}] Error sending OTP:`, signInError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to send magic link email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] Magic link sent successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Magic link sent! Check your email.' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[${requestId}] Unexpected error:`, error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
