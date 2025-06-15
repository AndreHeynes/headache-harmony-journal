
import React, { useState, useMemo } from 'react';
import { SKULL_HOTSPOTS, SkullView, Hotspot } from './skull-viewer/skull-hotspots';
import SkullImage from './skull-viewer/SkullImage';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const getHotspotZIndex = (hotspot: Hotspot) => {
  if (hotspot.id.includes('half-face')) return 800;
  if (hotspot.id.includes('pressure-band')) return 850;
  if (hotspot.id.includes('forehead')) return 900;
  if (hotspot.id.includes('eye') || hotspot.id.includes('temple')) return 950;
  return 800;
};

const isPressureBand = (id: string) => id.includes('pressure-band');
const isHalfFace = (id: string) => id.includes('half-face');

const SkullViewer = () => {
  const [currentView, setCurrentView] = useState<SkullView>('front');
  const [selectedHotspots, setSelectedHotspots] = useState<string[]>([]);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right'>('left');
  const [showBorders, setShowBorders] = useState(false);

  const currentViewHotspots = useMemo(
    () => SKULL_HOTSPOTS.filter((h) => h.view === currentView),
    [currentView]
  );

  const toggleHotspotSelection = (hotspotId: string) => {
    setSelectedHotspots((prev) =>
      prev.includes(hotspotId)
        ? prev.filter((id) => id !== hotspotId)
        : [...prev, hotspotId]
    );
  };

  const clearAllSelections = () => setSelectedHotspots([]);

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-6 py-4">
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* View Select */}
          <div className="flex gap-2 mb-4">
            {(['front', 'side', 'back'] as SkullView[]).map((view) => (
              <Button
                key={view}
                variant={currentView === view ? 'default' : 'outline'}
                onClick={() => setCurrentView(view)}
                className="capitalize bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-600"
              >
                {view} View
              </Button>
            ))}
          </div>
          {currentView === 'side' && (
            <>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium text-white">Side:</span>
                <div className="flex gap-1 border border-gray-600 rounded-lg overflow-hidden">
                  <Button
                    variant={selectedSide === 'left' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedSide('left')}
                    className="rounded-none border-0 bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Left
                  </Button>
                  <Button
                    variant={selectedSide === 'right' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedSide('right')}
                    className="rounded-none border-0 bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Right
                  </Button>
                </div>
              </div>
              <Button
                variant={showBorders ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowBorders(!showBorders)}
                className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
              >
                {showBorders ? 'Hide Borders' : 'Show Borders'}
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {selectedHotspots.length > 0 && (
            <>
              <div className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedHotspots.length} selected
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllSelections}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 border-red-400/30"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <SkullImage
          currentView={currentView}
          hotspots={currentViewHotspots}
          selectedHotspots={selectedHotspots}
          onHotspotToggle={toggleHotspotSelection}
          selectedSide={selectedSide}
          getHotspotZIndex={getHotspotZIndex}
          isPressureBand={isPressureBand}
          isHalfFace={isHalfFace}
          showBorders={showBorders}
        />
      </div>
    </div>
  );
};

export default SkullViewer;
