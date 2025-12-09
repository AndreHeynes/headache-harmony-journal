import { useState, useEffect } from 'react';

interface BetaUser {
  email: string;
  full_name: string;
  product: string;
}

interface TokenValidationResult {
  isValidating: boolean;
  isValid: boolean;
  user: BetaUser | null;
  error: string | null;
}

// HeadacheRecovery API endpoint
const VALIDATION_API_URL = 'https://plgarmijuqynxeyymkco.supabase.co/functions/v1/validate-beta-token';

export const useTokenValidation = (): TokenValidationResult => {
  const [state, setState] = useState<TokenValidationResult>({
    isValidating: true,
    isValid: false,
    user: null,
    error: null,
  });

  useEffect(() => {
    const validateToken = async () => {
      // Check localStorage for previously validated session
      const storedToken = localStorage.getItem('beta_token');
      const storedUser = localStorage.getItem('beta_user');

      if (storedToken && storedUser) {
        try {
          setState({
            isValidating: false,
            isValid: true,
            user: JSON.parse(storedUser),
            error: null,
          });
          return;
        } catch {
          // Invalid stored data, clear and continue
          localStorage.removeItem('beta_token');
          localStorage.removeItem('beta_user');
        }
      }

      // Get token from URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setState({
          isValidating: false,
          isValid: false,
          user: null,
          error: 'No access token provided. Please use your beta access link.',
        });
        return;
      }

      try {
        // Call HeadacheRecovery API directly
        const response = await fetch(VALIDATION_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!data.valid) {
          setState({
            isValidating: false,
            isValid: false,
            user: null,
            error: data.error || 'Invalid or expired token',
          });
          return;
        }

        // Store validated session
        localStorage.setItem('beta_token', token);
        localStorage.setItem('beta_user', JSON.stringify(data.user));

        // Clean URL (remove token parameter)
        window.history.replaceState({}, '', window.location.pathname);

        setState({
          isValidating: false,
          isValid: true,
          user: data.user,
          error: null,
        });
      } catch (err) {
        console.error('Token validation error:', err);
        setState({
          isValidating: false,
          isValid: false,
          user: null,
          error: 'Failed to validate access. Please try again.',
        });
      }
    };

    validateToken();
  }, []);

  return state;
};
