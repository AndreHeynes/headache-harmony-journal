
import { useState } from 'react';
import { Hotspot, getHotspotZIndex } from './skull-hotspots';

interface SkullImageProps {
  imageSrc: string;
  hotspots: Hotspot[];
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
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  // Use placeholder for now since original images are causing issues
  const displaySrc = imageError || !imageSrc
    ? 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=400&fit=crop&auto=format'
    : imageSrc;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <img 
        src={displaySrc}
        alt={`Skull ${view} view`}
        className="w-full h-auto rounded-lg shadow-lg"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ minHeight: '300px', backgroundColor: '#1a1a1a' }}
      />
      
      {/* Render hotspots */}
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          className={`absolute rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125 ${
            selectedHotspots.includes(hotspot.id)
              ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50'
              : 'bg-red-500 hover:bg-red-400'
          }`}
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            width: `${hotspot.size}px`,
            height: `${hotspot.size}px`,
            zIndex: getHotspotZIndex(hotspot),
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
