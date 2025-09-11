import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DisclaimerBannerProps {
  message: string;
  onDismiss?: () => void;
  onViewFull?: () => void;
  variant?: 'warning' | 'info' | 'error';
  persistent?: boolean;
}

export function DisclaimerBanner({ 
  message, 
  onDismiss, 
  onViewFull,
  variant = 'warning',
  persistent = false
}: DisclaimerBannerProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'error': return 'bg-red-500/20 border-red-500/30 text-red-200';
      case 'info': return 'bg-blue-500/20 border-blue-500/30 text-blue-200';
      default: return 'bg-amber-500/20 border-amber-500/30 text-amber-200';
    }
  };

  return (
    <div className={`border-l-4 p-3 mb-4 ${getVariantClasses()} flex items-start gap-3`}>
      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm">{message}</p>
        {onViewFull && (
          <Button
            variant="link"
            size="sm"
            onClick={onViewFull}
            className="p-0 h-auto text-current underline mt-1"
          >
            View full disclaimer
          </Button>
        )}
      </div>
      {!persistent && onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="h-auto p-1 text-current hover:bg-white/10"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}