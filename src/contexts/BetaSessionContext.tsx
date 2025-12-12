import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

// Use our local edge function for validation
const VALIDATION_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-and-auth`;

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

  const logout = useCallback(async () => {
    // Clear beta session
    setUser(null);
    setToken(null);
    setTokenExpiresAt(null);
    localStorage.removeItem('beta_access_token');
    localStorage.removeItem('beta_user');
    localStorage.removeItem('beta_token_expires_at');
    
    // Also sign out from Supabase
    await supabase.auth.signOut();
    
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
        
        // If we got a new Supabase session, set it
        if (data.supabase_session?.access_token) {
          await supabase.auth.setSession({
            access_token: data.supabase_session.access_token,
            refresh_token: data.supabase_session.refresh_token || '',
          });
        }
        
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
