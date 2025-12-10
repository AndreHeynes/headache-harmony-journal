import { ReactNode } from 'react';
import { useTokenValidation } from '@/hooks/useTokenValidation';
import { useBetaSession } from '@/contexts/BetaSessionContext';
import { Loader2, ShieldX, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BetaAccessGateProps {
  children: ReactNode;
}

const SIGNUP_URL = 'https://head-relief-journey-49917.lovable.app/#beta';

export const BetaAccessGate = ({ children }: BetaAccessGateProps) => {
  const { isValidating, isValid, error } = useTokenValidation();
  const { isTokenExpired, refreshSession } = useBetaSession();

  if (isValidating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Validating your access...</p>
      </div>
    );
  }

  // Handle expired token
  if (isTokenExpired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="max-w-md text-center space-y-6">
          <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Access Token Expired</h1>
          <p className="text-muted-foreground">
            Your beta access token has expired. Please request a new access link.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => refreshSession()} variant="outline">
              Try Refreshing
            </Button>
            <Button asChild size="lg">
              <a href={SIGNUP_URL}>Request New Access</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

  return <>{children}</>;
};
