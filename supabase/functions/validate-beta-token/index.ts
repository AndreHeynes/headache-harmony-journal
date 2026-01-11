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

  // Generate request ID for tracing
  const requestId = crypto.randomUUID().slice(0, 8);
  
  try {
    const { token } = await req.json();
    
    if (!token) {
      console.error(`[${requestId}] No token provided`);
      return new Response(
        JSON.stringify({ valid: false, error: 'No token provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] Validating token: ${token.slice(0, 8)}...`);

    // Get the Landing Page Supabase URL from secrets
    const landingPageUrl = Deno.env.get('LANDING_PAGE_SUPABASE_URL');
    if (!landingPageUrl) {
      console.error(`[${requestId}] LANDING_PAGE_SUPABASE_URL not configured`);
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
    console.log(`[${requestId}] Landing Page response:`, JSON.stringify({
      valid: validationResult.valid,
      hasUser: !!validationResult.user,
      product: validationResult.user?.product,
      error: validationResult.error
    }));

    // Check if token is valid and product is either "app" or "program"
    if (!validationResult.valid) {
      console.log(`[${requestId}] Token validation failed`);
      return new Response(
        JSON.stringify({ valid: false, error: validationResult.error || 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const allowedProducts = ['app', 'program'];
    if (!allowedProducts.includes(validationResult.user?.product)) {
      console.log(`[${requestId}] Product not authorized: ${validationResult.user?.product}`);
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

    console.log(`[${requestId}] Processing user: ${userEmail}`);

    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error(`[${requestId}] Error listing users:`, listError);
      return new Response(
        JSON.stringify({ valid: false, error: 'Failed to check user existence' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let userId: string;
    const existingUser = existingUsers.users.find(u => u.email === userEmail);
    console.log(`[${requestId}] User lookup - exists: ${!!existingUser}, total users: ${existingUsers.users.length}`);

    if (existingUser) {
      console.log(`[${requestId}] User already exists: ${existingUser.id}`);
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
        console.error(`[${requestId}] Error creating user:`, createError);
        return new Response(
          JSON.stringify({ valid: false, error: 'Failed to create user account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[${requestId}] Created new user: ${newUser.user.id}`);
      userId = newUser.user.id;
    }

    // Generate a magic link for the user
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: userEmail,
    });

    if (sessionError) {
      console.error(`[${requestId}] Error generating magic link:`, sessionError);
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

    console.log(`[${requestId}] Magic link generated successfully`);

    // Return the full action link for the frontend to redirect to
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
        actionLink: sessionData.properties.action_link,
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
