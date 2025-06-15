
import React, { useState, useMemo } from 'react';
import { SKULL_HOTSPOTS, SkullView } from './skull-viewer/skull-hotspots';
import SkullImage from './skull-viewer/SkullImage';
import { ViewControls } from './skull-viewer/ViewControls';
import { SelectionInfo } from './skull-viewer/SelectionInfo';

const SkullViewer = () => {
  const [currentView, setCurrentView] = useState<SkullView>('front');
  const [selectedHotspots, setSelectedHotspots] = useState<string[]>([]);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right'>('left');

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
        <ViewControls
          currentView={currentView}
          onViewChange={setCurrentView}
          selectedSide={selectedSide}
          onSideChange={setSelectedSide}
        />
        <SelectionInfo
          selectedCount={selectedHotspots.length}
          onClearAll={clearAllSelections}
        />
      </div>
      <div className="flex justify-center items-center">
        <SkullImage
          currentView={currentView}
          hotspots={currentViewHotspots}
          selectedHotspots={selectedHotspots}
          onHotspotToggle={toggleHotspotSelection}
          selectedSide={selectedSide}
        />
      </div>
    </div>
  );
};

export default SkullViewer;
