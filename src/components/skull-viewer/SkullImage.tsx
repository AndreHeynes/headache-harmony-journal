
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
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    console.log('Image failed to load:', imageSrc);
    setHasError(true);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageSrc);
    setHasError(false);
  };

  // Use a placeholder image if the skull image fails to load
  const displaySrc = hasError 
    ? 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=400&fit=crop'
    : imageSrc;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <img 
          src={displaySrc}
          alt={`Skull ${view} view`}
          className="w-full h-auto rounded-lg shadow-lg"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ minHeight: '300px', backgroundColor: '#1a1a1a' }}
        />
        
        {hasError && (
          <div className="absolute top-2 left-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded">
            Using placeholder - original failed
          </div>
        )}
      </div>
      
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
          onClick={() => {
            console.log('Hotspot clicked:', hotspot.id, hotspot.name);
            onHotspotClick(hotspot.id);
          }}
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
