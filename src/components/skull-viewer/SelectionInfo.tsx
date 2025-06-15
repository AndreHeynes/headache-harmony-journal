
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SelectionInfoProps {
  selectedCount: number;
  onClearAll: () => void;
}

export const SelectionInfo = ({ selectedCount, onClearAll }: SelectionInfoProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">
        {selectedCount} selected
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 border-red-400/30"
      >
        <X className="w-4 h-4 mr-1" />
        Clear All
      </Button>
    </div>
  );
};
