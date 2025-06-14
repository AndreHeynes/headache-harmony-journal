
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { SkullImage } from './skull-viewer/SkullImage';
import { SKULL_IMAGES, SKULL_HOTSPOTS, SkullView } from './skull-viewer/skull-hotspots';

export function SkullViewer() {
  const [currentView, setCurrentView] = useState<SkullView>('front');
  const [selectedHotspots, setSelectedHotspots] = useState<string[]>([]);

  const handleHotspotClick = (hotspotId: string) => {
    setSelectedHotspots(prev => {
      const isSelected = prev.includes(hotspotId);
      const newSelection = isSelected 
        ? prev.filter(id => id !== hotspotId)
        : [...prev, hotspotId];
      
      const hotspot = SKULL_HOTSPOTS.find(h => h.id === hotspotId);
      
      toast({
        title: isSelected ? "Pain location removed" : "Pain location selected",
        description: `${hotspot?.name} ${isSelected ? 'removed from' : 'added to'} pain locations`,
      });
      
      return newSelection;
    });
  };

  const clearSelections = () => {
    setSelectedHotspots([]);
    toast({
      title: "Selections cleared",
      description: "All pain locations have been cleared",
    });
  };

  const currentHotspots = SKULL_HOTSPOTS.filter(hotspot => hotspot.view === currentView);

  return (
    <div className="space-y-6">
      {/* View Selection Buttons */}
      <div className="flex justify-center space-x-2">
        {(['front', 'side', 'back'] as SkullView[]).map((view) => (
          <Button
            key={view}
            variant={currentView === view ? "default" : "outline"}
            onClick={() => setCurrentView(view)}
            className={`capitalize ${
              currentView === view 
                ? "bg-cyan-500 hover:bg-cyan-600 text-white" 
                : "bg-gray-700/40 text-white hover:bg-gray-700/60 border-gray-600"
            }`}
          >
            {view} View
          </Button>
        ))}
      </div>

      {/* Skull Image with Hotspots */}
      <SkullImage
        imageSrc={SKULL_IMAGES[currentView]}
        hotspots={currentHotspots}
        selectedHotspots={selectedHotspots}
        onHotspotClick={handleHotspotClick}
        view={currentView}
      />

      {/* Selection Summary */}
      {selectedHotspots.length > 0 && (
        <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-white font-medium">Selected Pain Locations:</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelections}
              className="bg-gray-700/40 text-white hover:bg-gray-700/60 border-gray-600 text-xs"
            >
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {selectedHotspots.map(hotspotId => {
              const hotspot = SKULL_HOTSPOTS.find(h => h.id === hotspotId);
              return (
                <div key={hotspotId} className="flex justify-between items-center bg-black/20 rounded px-3 py-2">
                  <span className="text-white text-sm">{hotspot?.name}</span>
                  <span className="text-cyan-300 text-xs capitalize">{hotspot?.view} view</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-gray-400 text-sm">
        Click on the red dots to select pain locations. Selected areas will turn cyan.
      </div>
    </div>
  );
}
