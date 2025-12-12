import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// External landing page validation endpoint
const LANDING_PAGE_VALIDATION = 'https://plgarmijuqynxeyymkco.supabase.co/functions/v1/validate-beta-token';

interface ValidationRequest {
  token: string;
  product?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, product = 'app' }: ValidationRequest = await req.json();

    if (!token) {
      console.log('Validation failed: No token provided');
      return new Response(
        JSON.stringify({ valid: false, error: 'No token provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Validating token against landing page:', token.substring(0, 8) + '...');

    // Step 1: Validate token against the landing page's endpoint
    const validationResponse = await fetch(LANDING_PAGE_VALIDATION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, product }),
    });

    const validationData = await validationResponse.json();

    if (!validationData.valid || !validationData.user) {
      console.log('Token validation failed:', validationData.error);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: validationData.error || 'Invalid token' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Token validated for:', validationData.user.email);

    // Step 2: Auto-create or sign in user in THIS project's Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const userEmail = validationData.user.email;
    const fullName = validationData.user.full_name || '';
    let supabaseSession = null;

    try {
      // Check if user already exists
      const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error('Error listing users:', listError.message);
      }

      const existingUser = existingUsers?.users?.find(u => u.email === userEmail);

      if (existingUser) {
        console.log('User already exists:', existingUser.id);
        
        // Generate a session for existing user using magic link
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: userEmail,
        });

        if (linkError) {
          console.error('Error generating magic link:', linkError.message);
        } else if (linkData?.properties) {
          // Extract the token from the action link
          const actionLink = linkData.properties.action_link;
          if (actionLink) {
            // Parse the token from the URL
            const url = new URL(actionLink);
            const hashParams = new URLSearchParams(url.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            
            if (accessToken) {
              supabaseSession = {
                access_token: accessToken,
                refresh_token: refreshToken || '',
                user: existingUser,
              };
              console.log('Session generated for existing user');
            }
          }
        }
      } else {
        // Create new user with auto-generated password
        console.log('Creating new Supabase user for:', userEmail);
        
        const tempPassword = crypto.randomUUID() + crypto.randomUUID(); // Strong random password
        
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: userEmail,
          password: tempPassword,
          email_confirm: true, // Skip email verification - verified via beta token
          user_metadata: {
            full_name: fullName,
            beta_product: product,
          },
        });

        if (createError) {
          console.error('Failed to create user:', createError.message);
        } else if (newUser?.user) {
          console.log('User created successfully:', newUser.user.id);
          
          // Generate session for new user
          const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email: userEmail,
          });

          if (linkError) {
            console.error('Error generating magic link for new user:', linkError.message);
          } else if (linkData?.properties) {
            const actionLink = linkData.properties.action_link;
            if (actionLink) {
              const url = new URL(actionLink);
              const hashParams = new URLSearchParams(url.hash.substring(1));
              const accessToken = hashParams.get('access_token');
              const refreshToken = hashParams.get('refresh_token');
              
              if (accessToken) {
                supabaseSession = {
                  access_token: accessToken,
                  refresh_token: refreshToken || '',
                  user: newUser.user,
                };
                console.log('Session generated for new user');
              }
            }
          }
        }
      }
    } catch (authError) {
      console.error('Auth error:', authError);
      // Continue without Supabase session - user can still use beta features
    }

    // Return combined response
    const response: Record<string, unknown> = {
      valid: true,
      user: validationData.user,
      token_expires_at: validationData.token_expires_at,
    };

    if (supabaseSession) {
      response.supabase_session = supabaseSession;
      console.log('Response includes Supabase session');
    } else {
      console.log('Response without Supabase session - user may need manual auth');
    }

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Validation error:', error);
    return new Response(
      JSON.stringify({ valid: false, error: 'Server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
