import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { APP_CONFIG } from '@/config/appConfig';

interface BetaModeRedirectProps {
  children: ReactNode;
}

export const BetaModeRedirect = ({ children }: BetaModeRedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (APP_CONFIG.BETA_MODE) {
      toast.info('During beta testing, authentication is handled via your beta access link.');
      navigate('/');
    }
  }, [navigate]);

  // In beta mode, don't render children (will redirect)
  if (APP_CONFIG.BETA_MODE) {
    return null;
  }

  // In production mode, render the auth page normally
  return <>{children}</>;
};
