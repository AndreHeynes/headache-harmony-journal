import { useTokenValidation } from '@/hooks/useTokenValidation';
import { Loader2, ShieldX } from 'lucide-react';

interface BetaAccessGateProps {
  children: React.ReactNode;
}

export const BetaAccessGate = ({ children }: BetaAccessGateProps) => {
  const { isValidating, isValid, user, error } = useTokenValidation();

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Validating your access...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'You need a valid beta access token to use this application.'}
          </p>
          <a
            href="https://head-relief-journey-49917.lovable.app/#beta"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign Up for Beta Access
          </a>
        </div>
      </div>
    );
  }

  // User is validated - show welcome message in console (optional)
  console.log('Beta user validated:', user?.full_name);

  return <>{children}</>;
};
