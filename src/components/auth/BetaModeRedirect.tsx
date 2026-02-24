import { ReactNode, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { APP_CONFIG } from '@/config/appConfig';

interface BetaModeRedirectProps {
  children: ReactNode;
}

export const BetaModeRedirect = ({ children }: BetaModeRedirectProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  // Allow access to /auth?mode=signin for beta magic link sign-in
  const isAllowedBetaRoute = mode === 'signin';

  useEffect(() => {
    if (APP_CONFIG.BETA_MODE && !isAllowedBetaRoute) {
      toast.info('During beta testing, authentication is handled via your beta access link.');
      navigate('/');
    }
  }, [navigate, isAllowedBetaRoute]);

  // In beta mode, block unless it's an allowed route
  if (APP_CONFIG.BETA_MODE && !isAllowedBetaRoute) {
    return null;
  }

  // Render the auth page
  return <>{children}</>;
};
