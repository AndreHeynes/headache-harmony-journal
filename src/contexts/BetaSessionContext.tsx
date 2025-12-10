import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface BetaUser {
  email: string;
  full_name?: string;
  product: string;
}

interface BetaSessionContextType {
  user: BetaUser | null;
  token: string | null;
  tokenExpiresAt: Date | null;
  isAuthenticated: boolean;
  isTokenExpired: boolean;
  logout: () => void;
  setSession: (user: BetaUser, token: string, expiresAt?: string) => void;
  refreshSession: () => Promise<boolean>;
}

const BetaSessionContext = createContext<BetaSessionContextType | undefined>(undefined);

const VALIDATION_ENDPOINT = 'https://plgarmijuqynxeyymkco.supabase.co/functions/v1/validate-beta-token';

export const BetaSessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<BetaUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<Date | null>(null);

  // Check if token is expired
  const isTokenExpired = tokenExpiresAt ? new Date() > tokenExpiresAt : false;

  useEffect(() => {
    // Restore session from localStorage on mount
    const storedToken = localStorage.getItem('beta_access_token');
    const storedUser = localStorage.getItem('beta_user');
    const storedExpiry = localStorage.getItem('beta_token_expires_at');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedExpiry) {
          setTokenExpiresAt(new Date(storedExpiry));
        }
      } catch (e) {
        // Invalid stored data, clear it
        localStorage.removeItem('beta_access_token');
        localStorage.removeItem('beta_user');
        localStorage.removeItem('beta_token_expires_at');
      }
    }
  }, []);

  const setSession = useCallback((newUser: BetaUser, newToken: string, expiresAt?: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem('beta_access_token', newToken);
    localStorage.setItem('beta_user', JSON.stringify(newUser));
    
    if (expiresAt) {
      setTokenExpiresAt(new Date(expiresAt));
      localStorage.setItem('beta_token_expires_at', expiresAt);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setTokenExpiresAt(null);
    localStorage.removeItem('beta_access_token');
    localStorage.removeItem('beta_user');
    localStorage.removeItem('beta_token_expires_at');
    // Redirect to HeadacheRecovery signup
    window.location.href = 'https://head-relief-journey-49917.lovable.app/#beta';
  }, []);

  // Re-validate token with server (useful when token might be expired)
  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (!token) return false;
    
    try {
      const response = await fetch(VALIDATION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, product: 'app' }),
      });
      
      const data = await response.json();
      
      if (data.valid && data.user) {
        setSession(data.user, token, data.token_expires_at);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (err) {
      console.error('Session refresh error:', err);
      return false;
    }
  }, [token, setSession, logout]);

  return (
    <BetaSessionContext.Provider 
      value={{ 
        user, 
        token,
        tokenExpiresAt,
        isAuthenticated: !!user && !!token && !isTokenExpired,
        isTokenExpired,
        logout,
        setSession,
        refreshSession
      }}
    >
      {children}
    </BetaSessionContext.Provider>
  );
};

export const useBetaSession = () => {
  const context = useContext(BetaSessionContext);
  if (context === undefined) {
    throw new Error('useBetaSession must be used within a BetaSessionProvider');
  }
  return context;
};
