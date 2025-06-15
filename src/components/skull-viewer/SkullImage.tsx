
import React, { useState } from 'react';
import { SkullView, SKULL_IMAGES, Hotspot } from './skull-hotspots';
import { HotspotOverlay } from './HotspotOverlay';

interface SkullImageProps {
  currentView: SkullView;
  hotspots: Hotspot[];
  selectedHotspots: string[];
  onHotspotToggle: (hotspotId: string) => void;
  selectedSide?: 'left' | 'right';
}

const SkullImage = ({
  currentView,
  hotspots,
  selectedHotspots,
  onHotspotToggle,
  selectedSide,
}: SkullImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    console.log(`Image loaded successfully: ${SKULL_IMAGES[currentView]}`);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${SKULL_IMAGES[currentView]}`);
    setImageError(true);
    setImageLoaded(false);
  };

  console.log(`Attempting to load image for ${currentView} view:`, SKULL_IMAGES[currentView]);

  return (
    <div className="w-full max-w-[390px]">
      <div
        className="relative w-full"
        style={{
          width: '100%',
          maxWidth: '390px',
          aspectRatio: '1/1',
          minHeight: '390px',
        }}
      >
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 border-2 border-gray-300 rounded-lg">
            <div className="text-center text-gray-600">
              <p>Failed to load {currentView} view</p>
              <p className="text-xs">{SKULL_IMAGES[currentView]}</p>
            </div>
          </div>
        )}
        
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-lg">
            <div className="text-center text-gray-600">
              <p>Loading {currentView} view...</p>
            </div>
          </div>
        )}

        <img
          src={SKULL_IMAGES[currentView]}
          alt={`Skull ${currentView} view`}
          draggable={false}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '390px',
            borderRadius: '.75rem',
            border: '2px solid #d1d5db',
            display: imageError ? 'none' : 'block',
          }}
        />
        
        {imageLoaded && !imageError && hotspots.map((hotspot) => (
          <HotspotOverlay
            key={hotspot.id}
            hotspot={hotspot}
            isSelected={selectedHotspots.includes(hotspot.id)}
            onToggle={onHotspotToggle}
            selectedSide={selectedSide}
            currentView={currentView}
          />
        ))}
      </div>
    </div>
  );
};

export default SkullImage;
