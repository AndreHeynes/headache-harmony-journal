import { useState, useEffect, useRef } from 'react';
import { useBetaSession } from '@/contexts/BetaSessionContext';
import { supabase } from '@/integrations/supabase/client';

interface TokenValidationResult {
  isValidating: boolean;
  isValid: boolean;
  error: string | null;
}

// Use our local edge function that handles both validation AND auto-auth
const VALIDATION_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-and-auth`;

export const useTokenValidation = (): TokenValidationResult => {
  const { user, token, isAuthenticated, isTokenExpired, setSession } = useBetaSession();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasValidated = useRef(false);

  useEffect(() => {
    // Prevent duplicate validation calls
    if (hasValidated.current) return;
    
    const validateToken = async () => {
      // If already authenticated and not expired, skip API call
      if (isAuthenticated && user && !isTokenExpired) {
        setIsValid(true);
        setIsValidating(false);
        hasValidated.current = true;
        return;
      }

      // Check for token in URL first
      const urlParams = new URLSearchParams(window.location.search);
      let tokenToValidate = urlParams.get('token');

      // Fall back to stored token
      if (!tokenToValidate) {
        tokenToValidate = token || localStorage.getItem('beta_access_token');
      }

      if (!tokenToValidate) {
        setIsValid(false);
        setIsValidating(false);
        setError('No access token found');
        hasValidated.current = true;
        return;
      }

      try {
        console.log('Validating token via local endpoint...');
        
        const response = await fetch(VALIDATION_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            token: tokenToValidate,
            product: 'app'
          }),
        });

        const data = await response.json();

        if (data.valid && data.user) {
          // Set beta session
          setSession(data.user, tokenToValidate, data.token_expires_at);
          setIsValid(true);
          setError(null);
          
          // If we got a Supabase session, set it automatically
          if (data.supabase_session?.access_token) {
            console.log('Auto-authenticating with Supabase session...');
            
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: data.supabase_session.access_token,
              refresh_token: data.supabase_session.refresh_token || '',
            });

            if (sessionError) {
              console.error('Failed to set Supabase session:', sessionError.message);
              // Don't fail the whole flow - beta access still works
            } else {
              console.log('Supabase session set successfully - user fully authenticated');
            }
          }
          
          // Clean up URL if token was in query params
          if (urlParams.has('token')) {
            window.history.replaceState({}, '', window.location.pathname);
          }
        } else {
          setIsValid(false);
          setError(data.error || 'Invalid or expired token');
          // Clear invalid stored data
          localStorage.removeItem('beta_access_token');
          localStorage.removeItem('beta_user');
          localStorage.removeItem('beta_token_expires_at');
        }
      } catch (err) {
        setIsValid(false);
        setError('Failed to validate token');
        console.error('Token validation error:', err);
      } finally {
        setIsValidating(false);
        hasValidated.current = true;
      }
    };

    validateToken();
  }, [isAuthenticated, user, token, isTokenExpired, setSession]);

  return { isValidating, isValid, error };
};
