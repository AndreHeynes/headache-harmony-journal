import React, { ReactNode } from 'react';
import { useDisclaimer } from '@/contexts/DisclaimerContext';
import { DisclaimerModal } from './DisclaimerModal';

interface DisclaimerGateProps {
  children: ReactNode;
  disclaimerId: string;
  fallback?: ReactNode;
  onAccepted?: () => void;
  onDeclined?: () => void;
}

/**
 * DisclaimerGate - Blocks content until user accepts required disclaimer
 * Used to gate premium AI features requiring legal acceptance
 */
export function DisclaimerGate({ 
  children, 
  disclaimerId, 
  fallback,
  onAccepted,
  onDeclined
}: DisclaimerGateProps) {
  const { 
    hasAcceptedDisclaimer, 
    setShowDisclaimerModal,
    setPendingDisclaimerId 
  } = useDisclaimer();

  const isAccepted = hasAcceptedDisclaimer(disclaimerId);

  const handleShowDisclaimer = () => {
    setPendingDisclaimerId(disclaimerId);
    setShowDisclaimerModal(true);
  };

  const handleAccept = () => {
    onAccepted?.();
  };

  const handleDecline = () => {
    onDeclined?.();
  };

  if (isAccepted) {
    return <>{children}</>;
  }

  return (
    <>
      {fallback || (
        <div className="bg-gray-800/50 border border-amber-500/30 rounded-lg p-4">
          <div className="text-amber-200 text-sm mb-3">
            <strong>Legal Disclaimer Required</strong>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            This AI-powered feature requires acceptance of our legal disclaimer. 
            The disclaimer explains that AI-generated content is not medical advice.
          </p>
          <button
            onClick={handleShowDisclaimer}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Review & Accept Disclaimer
          </button>
        </div>
      )}

      <DisclaimerModal
        disclaimerId={disclaimerId}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </>
  );
}