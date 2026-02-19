import React, { createContext, useContext } from 'react';
import { useRedFlagScreening } from '@/hooks/useRedFlagScreening';

type RedFlagScreeningContextType = ReturnType<typeof useRedFlagScreening>;

const RedFlagScreeningContext = createContext<RedFlagScreeningContextType | null>(null);

export function RedFlagScreeningProvider({ children }: { children: React.ReactNode }) {
  const screening = useRedFlagScreening();
  return (
    <RedFlagScreeningContext.Provider value={screening}>
      {children}
    </RedFlagScreeningContext.Provider>
  );
}

export function useScreening() {
  const ctx = useContext(RedFlagScreeningContext);
  if (!ctx) throw new Error('useScreening must be used within RedFlagScreeningProvider');
  return ctx;
}
