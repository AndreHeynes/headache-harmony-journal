
import React from 'react';
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onCancel: () => void;
  onReview: () => void;
  isDisabled: boolean;
}

export function ActionButtons({ onCancel, onReview, isDisabled }: ActionButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 border-t border-gray-800">
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1 bg-gray-800 text-gray-300"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 bg-indigo-600 text-white"
          onClick={onReview}
          disabled={isDisabled}
        >
          Review & Save
        </Button>
      </div>
    </div>
  );
}
