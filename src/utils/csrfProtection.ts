
/**
 * CSRF Protection Utility
 * 
 * This utility provides basic CSRF protection functionality for when the app integrates with a backend.
 * Note: Will need to be updated when actual backend is implemented.
 */

/**
 * Generate a CSRF token
 */
export const generateCSRFToken = (): string => {
  // Generate a random string to use as a token
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);
  
  const token = Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  
  // Store the token in sessionStorage
  sessionStorage.setItem('csrf_token', token);
  
  return token;
};

/**
 * Get the current CSRF token or generate a new one
 */
export const getCSRFToken = (): string => {
  let token = sessionStorage.getItem('csrf_token');
  
  if (!token) {
    token = generateCSRFToken();
  }
  
  return token;
};

/**
 * Validate a CSRF token
 */
export const validateCSRFToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem('csrf_token');
  return !!storedToken && token === storedToken;
};

/**
 * Add CSRF token to request headers
 */
export const addCSRFTokenToHeaders = (headers: HeadersInit = {}): HeadersInit => {
  return {
    ...headers,
    'X-CSRF-Token': getCSRFToken()
  };
};

/**
 * Create a hidden input with CSRF token for forms
 */
export const CSRFTokenInput = (): JSX.Element => {
  return (
    <input 
      type="hidden" 
      name="csrf_token" 
      value={getCSRFToken()} 
    />
  );
};
