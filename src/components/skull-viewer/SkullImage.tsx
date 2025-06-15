
import React, { useState } from 'react';
import { SkullView, SKULL_IMAGES, Hotspot } from './skull-hotspots';

interface SkullImageProps {
  currentView: SkullView;
  hotspots: Hotspot[];
  selectedHotspots: string[];
  onHotspotToggle: (hotspotId: string) => void;
  selectedSide?: 'left' | 'right';
  getHotspotZIndex: (hotspot: Hotspot) => number;
  isPressureBand: (id: string) => boolean;
  isHalfFace: (id: string) => boolean;
}

interface HotspotOverlayProps {
  hotspot: Hotspot;
  isSelected: boolean;
  onToggle: (hotspotId: string) => void;
  selectedSide?: 'left' | 'right';
  getHotspotZIndex: (hotspot: Hotspot) => number;
  isPressureBand: (id: string) => boolean;
  isHalfFace: (id: string) => boolean;
}

const HotspotOverlay = ({
  hotspot,
  isSelected,
  onToggle,
  selectedSide,
  getHotspotZIndex,
  isPressureBand,
  isHalfFace,
}: HotspotOverlayProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    setShowTooltip(true);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const getDisplayTitle = () => {
    if (hotspot.view === 'side' && selectedSide) {
      const title = hotspot.title;
      if (!title.toLowerCase().includes('left') && !title.toLowerCase().includes('right')) {
        return `${selectedSide === 'left' ? 'Left' : 'Right'} ${title}`;
      }
    }
    return hotspot.title;
  };

  return (
    <>
      <div
        className={`absolute cursor-pointer transition-all duration-150 hover:scale-110 ${
          isSelected ? 'cursor-pointer' : ''
        }`}
        style={{
          left: `${hotspot.x}%`,
          top: `${hotspot.y}%`,
          width: isPressureBand(hotspot.id) ? `${hotspot.size}%` : 
                 isHalfFace(hotspot.id) ? `${hotspot.size * 0.6}%` : `${hotspot.size}%`,
          height: isPressureBand(hotspot.id) ? `${hotspot.size * 0.15}%` : 
                  isHalfFace(hotspot.id) ? `${hotspot.size * 1.2}%` : `${hotspot.size}%`,
          transform: 'translate(-50%, -50%)',
          background: 'transparent',
          zIndex: getHotspotZIndex(hotspot),
          borderRadius: isPressureBand(hotspot.id) ? '50px' : 
                       isHalfFace(hotspot.id) ? '8px' : '50%',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(hotspot.id);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        id={hotspot.id}
      />
      {isSelected && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: getHotspotZIndex(hotspot) + 1,
          }}
        >
          <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
        </div>
      )}

      {showTooltip && (
        <div
          className="fixed z-[9999] bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg pointer-events-none"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 40,
            transform: 'translateY(-100%)',
          }}
        >
          {getDisplayTitle()}
        </div>
      )}
    </>
  );
};

const SkullImage = ({
  currentView,
  hotspots,
  selectedHotspots,
  onHotspotToggle,
  selectedSide,
  getHotspotZIndex,
  isPressureBand,
  isHalfFace,
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
            getHotspotZIndex={getHotspotZIndex}
            isPressureBand={isPressureBand}
            isHalfFace={isHalfFace}
          />
        ))}
      </div>
    </div>
  );
};

export default SkullImage;
