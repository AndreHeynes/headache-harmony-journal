import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface BetaUser {
  email: string;
  full_name: string;
  product: string;
}

interface AuthContextType {
  // Supabase auth
  user: User | null;
  session: Session | null;
  loading: boolean;
  
  // Beta info
  betaUser: BetaUser | null;
  hasBetaAccess: boolean;
  
  // Auth status
  justAuthenticated: boolean;
  
  // Actions
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Verify profile exists and create if missing (fallback for trigger failure)
const verifyAndCreateProfile = async (userId: string, email: string, fullName?: string) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      console.log('[Auth] Profile not found, creating fallback profile...');
      const { error: insertError } = await supabase.from('profiles').insert({
        id: userId,
        email: email || '',
        full_name: fullName || ''
      });
      
      if (insertError) {
        console.error('[Auth] Failed to create fallback profile:', insertError);
      } else {
        console.log('[Auth] Fallback profile created successfully');
      }
    } else if (error) {
      console.error('[Auth] Error checking profile:', error);
    } else {
      console.log('[Auth] Profile exists:', profile.id);
    }
  } catch (err) {
    console.error('[Auth] verifyAndCreateProfile error:', err);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [betaUser, setBetaUser] = useState<BetaUser | null>(null);
  const [justAuthenticated, setJustAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load beta user from localStorage
    const storedBetaUser = localStorage.getItem('beta_user');
    if (storedBetaUser) {
      try {
        setBetaUser(JSON.parse(storedBetaUser));
      } catch (e) {
        console.error('[Auth] Failed to parse beta user:', e);
        localStorage.removeItem('beta_user');
      }
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[Auth] Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Verify profile exists after sign in (deferred to avoid deadlock)
        if (event === 'SIGNED_IN' && session?.user) {
          // Set justAuthenticated flag for 4 seconds
          setJustAuthenticated(true);
          setTimeout(() => setJustAuthenticated(false), 4000);
          
          setTimeout(() => {
            verifyAndCreateProfile(
              session.user.id,
              session.user.email || '',
              session.user.user_metadata?.full_name || ''
            );
          }, 0);
          
          // Navigate to dashboard
          setTimeout(() => {
            navigate('/dashboard');
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setTimeout(() => {
            navigate('/');
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[Auth] Initial session check:', session?.user?.email || 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Trigger Landing Page email sequence after signup
  const triggerEmailSequence = async (email: string, name: string) => {
    try {
      const response = await fetch(
        "https://plgarmijuqynxeyymkco.supabase.co/functions/v1/queue-email-sequence",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZ2FybWlqdXF5bnhleXlta2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NDg4NDMsImV4cCI6MjA4MDUyNDg0M30.Mmp7C2efUazxM2poJlB44aob-c3CQce-wzU8a_0ExxQ"
          },
          body: JSON.stringify({
            email: email,
            name: name,
            sequence_name: "beta_app",
            source: "app_signup"
          })
        }
      );
      const result = await response.json();
      console.log('[Auth] Email sequence triggered:', result);
      return result;
    } catch (err) {
      console.error('[Auth] Failed to trigger email sequence:', err);
      // Don't throw - email failure shouldn't block signup
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    
    // Trigger email sequence on successful signup (fire-and-forget)
    if (!error) {
      triggerEmailSequence(email, fullName);
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signInWithMagicLink = async (email: string): Promise<{ error: string | null }> => {
    try {
      // Call the edge function to send a magic link for beta users
      const { data, error } = await supabase.functions.invoke('send-beta-magic-link', {
        body: { email }
      });

      if (error) {
        console.error('[Auth] Magic link error:', error);
        return { error: error.message || 'Failed to send magic link' };
      }

      if (!data?.success) {
        return { error: data?.error || 'Failed to send magic link' };
      }

      return { error: null };
    } catch (err) {
      console.error('[Auth] Magic link exception:', err);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('beta_token');
    localStorage.removeItem('beta_user');
    setBetaUser(null);
    setJustAuthenticated(false);
  };

  const hasBetaAccess = !!betaUser && !!localStorage.getItem('beta_token');

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      betaUser,
      hasBetaAccess,
      justAuthenticated,
      signUp, 
      signIn, 
      signInWithMagicLink,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
