import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BetaUser {
  email: string;
  full_name: string;
  product: string;
}

interface TokenValidationResult {
  isValidating: boolean;
  isValid: boolean;
  user: BetaUser | null;
  isNewUser: boolean;
  error: string | null;
}

const VALIDATION_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-beta-token`;

export const useTokenValidation = (): TokenValidationResult => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [user, setUser] = useState<BetaUser | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasValidated = useRef(false);

  useEffect(() => {
    if (hasValidated.current) return;

    const validateToken = async () => {
      try {
        // Check URL for token first
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token') || localStorage.getItem('beta_token');

        if (!token) {
          setIsValidating(false);
          setError('No beta access token found');
          return;
        }

        // Check if already authenticated with Supabase
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          // Already logged in - validate they still have beta access
          const storedUser = localStorage.getItem('beta_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsValid(true);
            setIsValidating(false);
            hasValidated.current = true;
            return;
          }
        }

        console.log('Validating token via endpoint...');

        // Call the validate-beta-token endpoint
        const response = await fetch(VALIDATION_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.valid && data.user) {
          // Store beta user info
          localStorage.setItem('beta_token', token);
          localStorage.setItem('beta_user', JSON.stringify(data.user));
          setUser(data.user);
          setIsValid(true);
          setIsNewUser(data.isNewUser ?? true);

          // Handle magic link token authentication
          if (data.magicLinkToken) {
            console.log('Exchanging magic link token for session...');

            // Use verifyOtp to exchange the magic link token for a session
            const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
              token_hash: data.magicLinkToken,
              type: 'magiclink',
            });

            if (otpError) {
              console.error('Failed to verify magic link token:', otpError);
              // Try alternative: email + token
              const { error: altError } = await supabase.auth.verifyOtp({
                email: data.user.email,
                token: data.magicLinkToken,
                type: 'magiclink',
              });

              if (altError) {
                console.error('Alternative verification also failed:', altError);
                setError('Failed to establish session. Please try clicking your access link again.');
                setIsValid(false);
                localStorage.removeItem('beta_token');
                localStorage.removeItem('beta_user');
                setIsValidating(false);
                hasValidated.current = true;
                return;
              }
            }

            console.log('User authenticated successfully!');
          } else if (data.requiresSignIn) {
            // Edge function couldn't generate session - user needs to sign in
            console.log('Token valid but requires sign-in flow');
            // The user is valid but we couldn't auto-authenticate
            // They can still use the app with beta access, but may need to sign in
          } else if (data.supabase_session) {
            // Legacy: Handle direct session (backward compatibility)
            console.log('Setting Supabase session from direct response...');

            const { error: sessionError } = await supabase.auth.setSession({
              access_token: data.supabase_session.access_token,
              refresh_token: data.supabase_session.refresh_token,
            });

            if (sessionError) {
              console.error('Failed to set session:', sessionError);
              setError('Failed to establish session. Please try again.');
              setIsValid(false);
              localStorage.removeItem('beta_token');
              localStorage.removeItem('beta_user');
              setIsValidating(false);
              hasValidated.current = true;
              return;
            }
            
            console.log('User automatically logged in!');
          }

          // Clean up URL
          if (urlParams.has('token')) {
            window.history.replaceState({}, '', window.location.pathname);
          }
        } else {
          setError(data.error || 'Invalid or expired token');
          localStorage.removeItem('beta_token');
          localStorage.removeItem('beta_user');
        }
      } catch (err) {
        console.error('Token validation error:', err);
        setError('Failed to validate token');
      } finally {
        setIsValidating(false);
        hasValidated.current = true;
      }
    };

    validateToken();
  }, []);

  return { isValidating, isValid, user, isNewUser, error };
};
