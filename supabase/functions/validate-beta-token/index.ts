import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();
    
    if (!token) {
      console.error('No token provided');
      return new Response(
        JSON.stringify({ valid: false, error: 'No token provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Validating token with Landing Page backend...');

    // Get the Landing Page Supabase URL from secrets
    const landingPageUrl = Deno.env.get('LANDING_PAGE_SUPABASE_URL');
    if (!landingPageUrl) {
      console.error('LANDING_PAGE_SUPABASE_URL not configured');
      return new Response(
        JSON.stringify({ valid: false, error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Forward validation to Landing Page's validate-beta-token endpoint
    const validationResponse = await fetch(
      `${landingPageUrl}/functions/v1/validate-beta-token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      }
    );

    const validationResult = await validationResponse.json();
    console.log('Validation result from Landing Page:', JSON.stringify(validationResult));

    // Check if token is valid and product is either "app" or "program"
    if (!validationResult.valid) {
      console.log('Token validation failed');
      return new Response(
        JSON.stringify({ valid: false, error: validationResult.error || 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const allowedProducts = ['app', 'program'];
    if (!allowedProducts.includes(validationResult.user?.product)) {
      console.log('Product not authorized:', validationResult.user?.product);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'This token is not authorized for this application' 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Token is valid - create/retrieve user in this App's Auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const userEmail = validationResult.user.email;
    const userFullName = validationResult.user.full_name || '';

    console.log('Processing user:', userEmail);

    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return new Response(
        JSON.stringify({ valid: false, error: 'Failed to check user existence' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let userId: string;
    const existingUser = existingUsers.users.find(u => u.email === userEmail);

    if (existingUser) {
      console.log('User already exists:', existingUser.id);
      userId = existingUser.id;
    } else {
      // Create new user with a secure random password (they'll use token auth)
      const randomPassword = crypto.randomUUID() + crypto.randomUUID();
      
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: userEmail,
        password: randomPassword,
        email_confirm: true, // Auto-confirm since they validated via beta token
        user_metadata: {
          full_name: userFullName,
          beta_product: validationResult.user.product,
        },
      });

      if (createError) {
        console.error('Error creating user:', createError);
        return new Response(
          JSON.stringify({ valid: false, error: 'Failed to create user account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Created new user:', newUser.user.id);
      userId = newUser.user.id;
    }

    // Generate a session for the user using admin API
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: userEmail,
    });

    if (sessionError) {
      console.error('Error generating session link:', sessionError);
      // Fallback: return user info without session, frontend will handle
      return new Response(
        JSON.stringify({
          valid: true,
          user: {
            id: userId,
            email: userEmail,
            full_name: userFullName,
            product: validationResult.user.product,
          },
          isNewUser: !existingUser,
          requiresSignIn: true,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the token from the magic link
    const magicLinkUrl = new URL(sessionData.properties.action_link);
    const accessToken = magicLinkUrl.searchParams.get('token');

    console.log('Successfully processed beta token validation');

    return new Response(
      JSON.stringify({
        valid: true,
        user: {
          id: userId,
          email: userEmail,
          full_name: userFullName,
          product: validationResult.user.product,
        },
        isNewUser: !existingUser,
        magicLinkToken: accessToken,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ valid: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
