
import React from 'react';
import { Button } from '@/components/ui/button';
import { SkullView } from './skull-hotspots';

interface ViewControlsProps {
  currentView: SkullView;
  onViewChange: (view: SkullView) => void;
  selectedSide: 'left' | 'right';
  onSideChange: (side: 'left' | 'right') => void;
}

export const ViewControls = ({
  currentView,
  onViewChange,
  selectedSide,
  onSideChange,
}: ViewControlsProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-2 mb-4">
        {(['front', 'side', 'back'] as SkullView[]).map((view) => (
          <Button
            key={view}
            variant={currentView === view ? 'default' : 'outline'}
            onClick={() => onViewChange(view)}
            className="capitalize bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-600"
          >
            {view} View
          </Button>
        ))}
      </div>
      {currentView === 'side' && (
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium text-white">Side:</span>
          <div className="flex gap-1 border border-gray-600 rounded-lg overflow-hidden">
            <Button
              variant={selectedSide === 'left' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSideChange('left')}
              className="rounded-none border-0 bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Left
            </Button>
            <Button
              variant={selectedSide === 'right' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSideChange('right')}
              className="rounded-none border-0 bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Right
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
