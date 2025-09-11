import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { secureGetItem, secureSetItem } from '@/utils/secureStorage';
import { getCurrentDisclaimerVersion } from '@/utils/legalContent';

interface DisclaimerAcceptance {
  disclaimerId: string;
  version: string;
  acceptedAt: string;
  userId?: string;
}

interface DisclaimerContextType {
  // State
  acceptedDisclaimers: DisclaimerAcceptance[];
  
  // Actions
  markDisclaimerAccepted: (disclaimerId: string, userId?: string) => void;
  hasAcceptedDisclaimer: (disclaimerId: string) => boolean;
  needsDisclaimerUpdate: (disclaimerId: string) => boolean;
  clearAllAcceptances: () => void;
  
  // UI State
  showDisclaimerModal: boolean;
  setShowDisclaimerModal: (show: boolean) => void;
  pendingDisclaimerId: string | null;
  setPendingDisclaimerId: (id: string | null) => void;
}

const DisclaimerContext = createContext<DisclaimerContextType | undefined>(undefined);

const STORAGE_KEY = 'disclaimer_acceptances_v1';

interface DisclaimerProviderProps {
  children: ReactNode;
}

export function DisclaimerProvider({ children }: DisclaimerProviderProps) {
  const [acceptedDisclaimers, setAcceptedDisclaimers] = useState<DisclaimerAcceptance[]>([]);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [pendingDisclaimerId, setPendingDisclaimerId] = useState<string | null>(null);

  // Load accepted disclaimers from secure storage on mount
  useEffect(() => {
    const stored = secureGetItem<DisclaimerAcceptance[]>(STORAGE_KEY, []);
    setAcceptedDisclaimers(stored);
  }, []);

  // Save to secure storage whenever acceptances change
  useEffect(() => {
    secureSetItem(STORAGE_KEY, acceptedDisclaimers);
  }, [acceptedDisclaimers]);

  const markDisclaimerAccepted = (disclaimerId: string, userId?: string) => {
    const currentVersion = getCurrentDisclaimerVersion(disclaimerId);
    const acceptance: DisclaimerAcceptance = {
      disclaimerId,
      version: currentVersion,
      acceptedAt: new Date().toISOString(),
      userId
    };

    setAcceptedDisclaimers(prev => {
      // Remove any existing acceptance for this disclaimer
      const filtered = prev.filter(a => a.disclaimerId !== disclaimerId);
      return [...filtered, acceptance];
    });
  };

  const hasAcceptedDisclaimer = (disclaimerId: string): boolean => {
    const acceptance = acceptedDisclaimers.find(a => a.disclaimerId === disclaimerId);
    if (!acceptance) return false;

    const currentVersion = getCurrentDisclaimerVersion(disclaimerId);
    return acceptance.version === currentVersion;
  };

  const needsDisclaimerUpdate = (disclaimerId: string): boolean => {
    const acceptance = acceptedDisclaimers.find(a => a.disclaimerId === disclaimerId);
    if (!acceptance) return true;

    const currentVersion = getCurrentDisclaimerVersion(disclaimerId);
    return acceptance.version !== currentVersion;
  };

  const clearAllAcceptances = () => {
    setAcceptedDisclaimers([]);
  };

  const value: DisclaimerContextType = {
    acceptedDisclaimers,
    markDisclaimerAccepted,
    hasAcceptedDisclaimer,
    needsDisclaimerUpdate,
    clearAllAcceptances,
    showDisclaimerModal,
    setShowDisclaimerModal,
    pendingDisclaimerId,
    setPendingDisclaimerId
  };

  return (
    <DisclaimerContext.Provider value={value}>
      {children}
    </DisclaimerContext.Provider>
  );
}

export function useDisclaimer() {
  const context = useContext(DisclaimerContext);
  if (context === undefined) {
    throw new Error('useDisclaimer must be used within a DisclaimerProvider');
  }
  return context;
}