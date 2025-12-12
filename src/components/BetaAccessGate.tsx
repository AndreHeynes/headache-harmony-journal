import { ReactNode } from 'react';
import { useTokenValidation } from '@/hooks/useTokenValidation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldX, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/config/appConfig';

interface BetaAccessGateProps {
  children: ReactNode;
}

const SIGNUP_URL = APP_CONFIG.BETA_SIGNUP_URL;

export const BetaAccessGate = ({ children }: BetaAccessGateProps) => {
  // In production mode, bypass beta gating entirely
  if (!APP_CONFIG.BETA_MODE) {
    return <>{children}</>;
  }

  return <BetaGateContent>{children}</BetaGateContent>;
};

// Separate component to use hooks conditionally
const BetaGateContent = ({ children }: BetaAccessGateProps) => {
  const { isValidating, isValid, isNewUser, error } = useTokenValidation();
  const { user, loading: authLoading } = useAuth();

  // Show loading while validating token or checking auth
  if (isValidating || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Validating your access...</p>
      </div>
    );
  }

  // No valid beta token
  if (!isValid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="max-w-md text-center space-y-6">
          <ShieldX className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Beta Access Required</h1>
          <p className="text-muted-foreground">
            {error || 'You need a valid beta access token to use this app.'}
          </p>
          <Button asChild size="lg">
            <a href={SIGNUP_URL}>Request Beta Access</a>
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have access? Check your email for the access link.
          </p>
        </div>
      </div>
    );
  }

  // Valid beta token but existing user needs to log in
  if (isValid && !isNewUser && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="max-w-md text-center space-y-6">
          <LogIn className="h-16 w-16 text-primary mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Welcome Back!</h1>
          <p className="text-muted-foreground">
            Please log in with your existing account to continue.
          </p>
          <Button asChild size="lg">
            <a href="/auth">Go to Login</a>
          </Button>
        </div>
      </div>
    );
  }

  // All good - render app!
  return <>{children}</>;
};
