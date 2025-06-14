
import { useState } from 'react';
import { HotspotData } from './skull-hotspots';

interface SkullImageProps {
  imageSrc: string;
  hotspots: HotspotData[];
  selectedHotspots: string[];
  onHotspotClick: (hotspotId: string) => void;
  view: 'front' | 'side' | 'back';
}

export function SkullImage({ 
  imageSrc, 
  hotspots, 
  selectedHotspots, 
  onHotspotClick,
  view 
}: SkullImageProps) {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <img 
        src={imageSrc} 
        alt={`Skull ${view} view`}
        className="w-full h-auto rounded-lg shadow-lg"
        style={{ filter: 'brightness(0.9)' }}
      />
      
      {/* Render hotspots */}
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          className={`absolute w-4 h-4 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125 ${
            selectedHotspots.includes(hotspot.id)
              ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50'
              : 'bg-red-500 hover:bg-red-400'
          }`}
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
          }}
          onClick={() => onHotspotClick(hotspot.id)}
          onMouseEnter={() => setHoveredHotspot(hotspot.id)}
          onMouseLeave={() => setHoveredHotspot(null)}
          title={hotspot.name}
        />
      ))}
      
      {/* Tooltip for hovered hotspot */}
      {hoveredHotspot && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-md text-sm pointer-events-none z-10">
          {hotspots.find(h => h.id === hoveredHotspot)?.name}
        </div>
      )}
    </div>
  );
}
