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
  
  // Actions
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
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
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('beta_token');
    localStorage.removeItem('beta_user');
    setBetaUser(null);
  };

  const hasBetaAccess = !!betaUser && !!localStorage.getItem('beta_token');

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      betaUser,
      hasBetaAccess,
      signUp, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};