import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Shield } from 'lucide-react';
import { getDisclaimer } from '@/utils/legalContent';
import { useDisclaimer } from '@/contexts/DisclaimerContext';
import { useTestContext } from '@/contexts/TestContext';

interface DisclaimerModalProps {
  disclaimerId: string;
  onAccept: () => void;
  onDecline?: () => void;
  title?: string;
}

export function DisclaimerModal({ 
  disclaimerId, 
  onAccept, 
  onDecline,
  title 
}: DisclaimerModalProps) {
  const { showDisclaimerModal, setShowDisclaimerModal, markDisclaimerAccepted } = useDisclaimer();
  const { logTestEvent, isTestMode } = useTestContext();
  const disclaimer = getDisclaimer(disclaimerId);

  if (!disclaimer) {
    console.error(`Disclaimer not found: ${disclaimerId}`);
    return null;
  }

  const handleAccept = () => {
    markDisclaimerAccepted(disclaimerId);
    
    // Log acceptance for testing analytics
    if (isTestMode) {
      logTestEvent({
        type: "feature_usage",
        details: `Accepted disclaimer: ${disclaimerId}`,
        component: "DisclaimerModal",
        metadata: {
          disclaimerId,
          version: disclaimer.version,
          category: disclaimer.category
        }
      });
    }

    setShowDisclaimerModal(false);
    onAccept();
  };

  const handleDecline = () => {
    // Log decline for testing analytics
    if (isTestMode) {
      logTestEvent({
        type: "feature_usage", 
        details: `Declined disclaimer: ${disclaimerId}`,
        component: "DisclaimerModal",
        metadata: {
          disclaimerId,
          version: disclaimer.version,
          category: disclaimer.category
        }
      });
    }

    setShowDisclaimerModal(false);
    onDecline?.();
  };

  return (
    <Dialog open={showDisclaimerModal} onOpenChange={setShowDisclaimerModal}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            {title || disclaimer.title}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Please read and accept this important legal disclaimer to continue
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] w-full rounded-md border border-gray-700 p-4">
          <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
            {disclaimer.content}
          </div>
        </ScrollArea>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-blue-300 font-medium text-sm">Privacy Protected</span>
          </div>
          <p className="text-blue-200 text-xs">
            Your acceptance is stored securely and encrypted. Version: {disclaimer.version}
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            I Don't Accept
          </Button>
          <Button
            onClick={handleAccept}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            I Understand and Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}