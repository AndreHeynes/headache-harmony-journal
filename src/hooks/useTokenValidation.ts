import { useState, useEffect, useCallback } from 'react';

interface TokenValidationResult {
  isValidating: boolean;
  isValid: boolean;
  user: {
    email: string;
    full_name: string;
    product: string;
  } | null;
  error: string | null;
  clearBetaSession: () => void;
}

export const useTokenValidation = (): TokenValidationResult => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [user, setUser] = useState<TokenValidationResult['user']>(null);
  const [error, setError] = useState<string | null>(null);

  const clearBetaSession = useCallback(() => {
    localStorage.removeItem('beta_access_token');
    localStorage.removeItem('beta_user');
    setIsValid(false);
    setUser(null);
    setError(null);
    // Redirect to home or access denied page
    window.location.href = '/';
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      // Check URL for token first
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      
      // Check localStorage for existing session
      const storedToken = localStorage.getItem('beta_access_token');
      const storedUser = localStorage.getItem('beta_user');
      
      const token = urlToken || storedToken;
      
      if (!token) {
        setIsValidating(false);
        setIsValid(false);
        setError('No access token provided');
        return;
      }

      try {
        // Call HeadacheRecovery validation endpoint directly
        const response = await fetch(
          'https://plgarmijuqynxeyymkco.supabase.co/functions/v1/validate-beta-token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          }
        );

        const result = await response.json();

        if (result.valid && result.user) {
          // Store valid token and user for future sessions
          localStorage.setItem('beta_access_token', token);
          localStorage.setItem('beta_user', JSON.stringify(result.user));
          
          // Clean URL if token was in query params
          if (urlToken) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          }
          
          setUser(result.user);
          setIsValid(true);
        } else {
          // Clear any stored invalid session
          localStorage.removeItem('beta_access_token');
          localStorage.removeItem('beta_user');
          setError(result.error || 'Invalid token');
          setIsValid(false);
        }
      } catch (err) {
        console.error('Token validation error:', err);
        setError('Failed to validate token');
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, []);

  return { isValidating, isValid, user, error, clearBetaSession };
};
