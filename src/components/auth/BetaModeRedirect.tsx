import { ReactNode } from 'react';

interface BetaModeRedirectProps {
  children: ReactNode;
}

// Open beta: sign-up and sign-in pages are open to everyone.
export const BetaModeRedirect = ({ children }: BetaModeRedirectProps) => <>{children}</>;
