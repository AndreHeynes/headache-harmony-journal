import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('[validate-beta-token] Edge function loaded and ready');

// Persistent rate limiting using dedicated rate_limits table
async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  identifier: string,
  endpoint: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const now = Date.now();
  const windowStart = new Date(now);
  const windowEnd = new Date(now + windowMs);
  const windowStartIso = new Date(now - windowMs).toISOString();
  
  try {
    // Count recent attempts from this identifier within the current window
    const { count, error } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('window_end', new Date().toISOString());
    
    if (error) {
      console.log('Rate limit check error, allowing request:', error);
      return { allowed: true };
    }
    
    if ((count || 0) >= maxRequests) {
      return { 
        allowed: false, 
        retryAfter: Math.ceil(windowMs / 1000) 
      };
    }
    
    // Log this attempt in the rate_limits table
    await supabase.from('rate_limits').insert({
      identifier,
      endpoint,
      window_start: windowStart.toISOString(),
      window_end: windowEnd.toISOString(),
    });
    
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

// Cleanup old rate limit entries (call periodically)
async function cleanupRateLimits(supabase: ReturnType<typeof createClient>) {
  try {
    await supabase
      .from('rate_limits')
      .delete()
      .lt('window_end', new Date().toISOString());
  } catch (e) {
    console.log('Rate limit cleanup error:', e);
  }
}

Deno.serve(async (req) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID().slice(0, 8);
  
  console.log(`[${requestId}] ========================================`);
  console.log(`[${requestId}] Function invoked at ${new Date().toISOString()}`);
  console.log(`[${requestId}] Request method: ${req.method}`);
  console.log(`[${requestId}] Request URL: ${req.url}`);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] Handling CORS preflight request`);
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    console.log(`[${requestId}] Request body length: ${body.length}`);
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.error(`[${requestId}] Failed to parse request body:`, parseError);
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { token } = parsedBody;
    
    if (!token) {
      console.error(`[${requestId}] No token provided`);
      return new Response(
        JSON.stringify({ valid: false, error: 'No token provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] Validating token: ${token.slice(0, 8)}...`);

    // Initialize Supabase client for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Periodically cleanup old rate limit entries
    if (Math.random() < 0.1) { // 10% chance to cleanup
      cleanupRateLimits(supabaseAdmin);
    }

    // Check rate limit using dedicated rate_limits table
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rateLimit = await checkRateLimit(
      supabaseAdmin, 
      `${clientIp}:${token.slice(0, 8)}`,
      'validate-beta-token'
    );
    
    if (!rateLimit.allowed) {
      console.log(`[${requestId}] Rate limit exceeded for ${clientIp}`);
      return new Response(
        JSON.stringify({ valid: false, error: 'Too many requests. Please try again later.' }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.retryAfter || 60)
          } 
        }
      );
    }

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
    const duration = Date.now() - startTime;
    console.error(`[${requestId}] Unexpected error after ${duration}ms:`, error);
    console.error(`[${requestId}] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
    return new Response(
      JSON.stringify({ valid: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
