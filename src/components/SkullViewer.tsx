import React, { useState, useMemo, useEffect } from 'react';
import { SKULL_HOTSPOTS, SkullView, resolveAreaKey } from './skull-viewer/skull-hotspots';
import SkullImage from './skull-viewer/SkullImage';
import { ViewControls } from './skull-viewer/ViewControls';
import { SelectionInfo } from './skull-viewer/SelectionInfo';
import { SmartAnalysis } from './skull-viewer/SmartAnalysis';

interface SkullViewerProps {
  /** Called with the selected stable area keys (e.g. ["temple_left", "eye_right"]). */
  onSelectionChange?: (areaKeys: string[]) => void;
  /** Area keys to show as selected when the viewer first loads. */
  initialSelection?: string[];
}

const SkullViewer = ({ onSelectionChange, initialSelection }: SkullViewerProps) => {
  const [currentView, setCurrentView] = useState<SkullView>('front');
  const [selectedKeys, setSelectedKeys] = useState<string[]>(initialSelection ?? []);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right'>('left');
  const [hydrated, setHydrated] = useState((initialSelection ?? []).length > 0);

  // Hydrate once when saved selection arrives after mount
  useEffect(() => {
    if (!hydrated && initialSelection && initialSelection.length > 0) {
      setSelectedKeys(initialSelection);
      setHydrated(true);
    }
  }, [initialSelection, hydrated]);

  const currentViewHotspots = useMemo(
    () => SKULL_HOTSPOTS.filter((h) => h.view === currentView),
    [currentView]
  );

  const toggleHotspotSelection = (hotspotId: string) => {
    const hotspot = SKULL_HOTSPOTS.find((h) => h.id === hotspotId);
    if (!hotspot) return;
    const key = resolveAreaKey(hotspot, selectedSide);
    setHydrated(true);
    setSelectedKeys((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      onSelectionChange?.(next);
      return next;
    });
  };

  const clearAllSelections = () => {
    setHydrated(true);
    setSelectedKeys([]);
    onSelectionChange?.([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-6 py-4">
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <ViewControls
          currentView={currentView}
          onViewChange={setCurrentView}
          selectedSide={selectedSide}
          onSideChange={setSelectedSide}
        />
        <SelectionInfo selectedCount={selectedKeys.length} onClearAll={clearAllSelections} />
      </div>
      <div className="flex justify-center items-center">
        <SkullImage
          currentView={currentView}
          hotspots={currentViewHotspots}
          selectedKeys={selectedKeys}
          onHotspotToggle={toggleHotspotSelection}
          selectedSide={selectedSide}
        />
      </div>

      {selectedKeys.length > 0 && <SmartAnalysis selectedKeys={selectedKeys} />}
    </div>
  );
};

export default SkullViewer;
