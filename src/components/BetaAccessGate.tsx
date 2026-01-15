import { ReactNode } from 'react';
import { useTokenValidation } from '@/hooks/useTokenValidation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldX, Mail, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/config/appConfig';
import { Link } from 'react-router-dom';

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
  const { isValidating, isValid, error } = useTokenValidation();
  const { loading: authLoading } = useAuth();

  // Show loading while validating token or checking auth
  if (isValidating || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Validating your access...</p>
      </div>
    );
  }

  // No valid beta token (covers both missing token AND session establishment failures)
  if (!isValid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="max-w-md text-center space-y-6">
          <ShieldX className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Beta Access Required</h1>
          <p className="text-muted-foreground">
            {error || 'You need a valid beta access token to use this app.'}
          </p>
          
          <div className="space-y-3 pt-4">
            {/* New beta tester */}
            <Button asChild size="lg" className="w-full">
              <a href={SIGNUP_URL}>
                <KeyRound className="mr-2 h-4 w-4" />
                Request Beta Access
              </a>
            </Button>
            
            {/* Returning beta tester */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Already have access?
                </span>
              </div>
            </div>
            
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link to="/auth?mode=signin">
                <Mail className="mr-2 h-4 w-4" />
                Sign In with Email
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground pt-2">
            Check your email for the access link, or sign in with the email you used to register.
          </p>
        </div>
      </div>
    );
  }

  // All good - valid token AND session established - render app!
  return <>{children}</>;
};
