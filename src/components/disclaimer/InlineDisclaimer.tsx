import React from 'react';
import { AlertTriangle, Info, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getDisclaimer } from '@/utils/legalContent';

interface InlineDisclaimerProps {
  disclaimerId: string;
  variant?: 'default' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  condensed?: boolean;
  onViewFull?: () => void;
}

export function InlineDisclaimer({ 
  disclaimerId, 
  variant = 'warning',
  size = 'md',
  showTitle = true,
  condensed = false,
  onViewFull
}: InlineDisclaimerProps) {
  const disclaimer = getDisclaimer(disclaimerId);

  if (!disclaimer) {
    console.error(`Disclaimer not found: ${disclaimerId}`);
    return null;
  }

  const getIcon = () => {
    switch (variant) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'warning': return 'border-amber-500/30 bg-amber-500/10 text-amber-200';
      case 'info': return 'border-blue-500/30 bg-blue-500/10 text-blue-200';
      default: return 'border-gray-500/30 bg-gray-500/10 text-gray-200';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'p-2 text-xs';
      case 'lg': return 'p-4 text-sm';
      default: return 'p-3 text-xs';
    }
  };

  // Condensed version shows just key points
  const getContent = () => {
    if (condensed) {
      return "This AI-generated content is not medical advice. Always consult healthcare professionals for medical decisions.";
    }
    
    // Extract first paragraph or key points
    const lines = disclaimer.content.split('\n').filter(line => line.trim());
    const keyPoints = lines.slice(0, 3).join(' ');
    return keyPoints;
  };

  return (
    <Alert className={`${getVariantClasses()} ${getSizeClasses()}`}>
      {showTitle && (
        <AlertTitle className="flex items-center gap-2 mb-2">
          {getIcon()}
          Legal Disclaimer
        </AlertTitle>
      )}
      <AlertDescription className="leading-relaxed">
        {getContent()}
        {onViewFull && (
          <Button
            variant="link"
            size="sm"
            onClick={onViewFull}
            className="p-0 h-auto text-current underline ml-2"
          >
            Read full disclaimer
          </Button>
        )}
      </AlertDescription>
      <div className="text-xs opacity-60 mt-2">
        Version {disclaimer.version} • {disclaimer.lastUpdated}
      </div>
    </Alert>
  );
}