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
        console.log('[TokenValidation] Starting validation...');
        
        // Check URL for token first
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token') || localStorage.getItem('beta_token');

        console.log('[TokenValidation] Token sources:', {
          hasUrlToken: urlParams.has('token'),
          hasStoredToken: !!localStorage.getItem('beta_token'),
        });

        if (!token) {
          console.log('[TokenValidation] No token found');
          setIsValidating(false);
          setError('No beta access token found');
          return;
        }

        // Check if already authenticated with Supabase
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        console.log('[TokenValidation] Existing session:', !!existingSession);
        
        if (existingSession) {
          // Already logged in - validate they still have beta access
          const storedUser = localStorage.getItem('beta_user');
          if (storedUser) {
            console.log('[TokenValidation] Using stored beta user info');
            setUser(JSON.parse(storedUser));
            setIsValid(true);
            setIsValidating(false);
            hasValidated.current = true;
            return;
          }
        }

        console.log('[TokenValidation] Calling validation endpoint...');

        // Call the validate-beta-token endpoint
        const response = await fetch(VALIDATION_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        console.log('[TokenValidation] Response:', {
          valid: data.valid,
          hasUser: !!data.user,
          hasActionLink: !!data.actionLink,
          requiresSignIn: data.requiresSignIn,
          error: data.error,
        });

        if (data.valid && data.user) {
          // Store beta user info before any redirects
          localStorage.setItem('beta_token', token);
          localStorage.setItem('beta_user', JSON.stringify(data.user));
          setUser(data.user);
          setIsValid(true);
          setIsNewUser(data.isNewUser ?? true);

          // Handle magic link authentication via action link redirect
          if (data.actionLink) {
            console.log('[TokenValidation] Redirecting to action link for authentication...');
            
            // Clean up URL token before redirect
            if (urlParams.has('token')) {
              window.history.replaceState({}, '', window.location.pathname);
            }
            
            // Redirect to Supabase auth endpoint to complete login
            window.location.href = data.actionLink;
            return; // Stop execution, page will redirect
          }
          
          if (data.requiresSignIn) {
            // Edge function couldn't generate session - user needs to sign in manually
            console.log('[TokenValidation] Token valid but requires manual sign-in');
            // The user is valid but we couldn't auto-authenticate
            // They can still use the app with beta access
          }

          // Clean up URL
          if (urlParams.has('token')) {
            window.history.replaceState({}, '', window.location.pathname);
          }
        } else {
          console.log('[TokenValidation] Validation failed:', data.error);
          setError(data.error || 'Invalid or expired token');
          localStorage.removeItem('beta_token');
          localStorage.removeItem('beta_user');
        }
      } catch (err) {
        console.error('[TokenValidation] Error:', err);
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
