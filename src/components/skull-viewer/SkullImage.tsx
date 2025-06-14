
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Debug logging
  console.log('SkullImage Debug:', {
    view,
    imageSrc,
    imageLoaded,
    imageError,
    hotspotsCount: hotspots.length
  });

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', imageSrc);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('❌ Image failed to load:', imageSrc, e);
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Debug container with visible background */}
      <div 
        className="relative border-2 border-dashed border-yellow-400 bg-gray-800/50 rounded-lg"
        style={{ minHeight: '400px' }}
      >
        {/* Test with known working image as fallback */}
        <img 
          src={imageError ? 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=400&fit=crop' : imageSrc}
          alt={`Skull ${view} view`}
          className="w-full h-auto rounded-lg shadow-lg"
          style={{ filter: 'brightness(0.9)' }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Loading state */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg">
            <div className="text-white text-center">
              <div className="animate-spin h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>Loading skull image...</p>
              <p className="text-xs text-gray-400 mt-1">Path: {imageSrc}</p>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 rounded-lg border-2 border-red-500">
            <div className="text-white text-center p-4">
              <p className="text-red-400 font-medium">❌ Image Load Failed</p>
              <p className="text-xs text-gray-400 mt-1">Original: {imageSrc}</p>
              <p className="text-xs text-gray-400">Using fallback image</p>
            </div>
          </div>
        )}
        
        {/* Success indicator */}
        {imageLoaded && !imageError && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            ✅ {view} loaded
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
