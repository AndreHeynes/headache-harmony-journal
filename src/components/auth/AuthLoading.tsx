import { Loader2 } from 'lucide-react';

export const AuthLoading = () => {
  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-white/70">Checking authentication...</p>
      </div>
    </div>
  );
};
