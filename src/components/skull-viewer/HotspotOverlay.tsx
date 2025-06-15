
import React, { useState } from 'react';
import { SkullView, Hotspot } from './skull-hotspots';
import { getHotspotZIndex, getHotspotDimensions, getDisplayTitle } from './hotspot-utils';

interface HotspotOverlayProps {
  hotspot: Hotspot;
  isSelected: boolean;
  onToggle: (hotspotId: string) => void;
  selectedSide?: 'left' | 'right';
  currentView: SkullView;
}

export const HotspotOverlay = ({
  hotspot,
  isSelected,
  onToggle,
  selectedSide,
  currentView,
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

  const dimensions = getHotspotDimensions(hotspot);

  return (
    <>
      <div
        className="absolute cursor-pointer transition-all duration-150 hover:scale-110"
        style={{
          left: `${hotspot.x}%`,
          top: `${hotspot.y}%`,
          width: dimensions.width,
          height: dimensions.height,
          transform: 'translate(-50%, -50%)',
          background: 'transparent',
          border: 'none',
          zIndex: getHotspotZIndex(hotspot),
          borderRadius: dimensions.borderRadius,
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
          {getDisplayTitle(hotspot, selectedSide)}
        </div>
      )}
    </>
  );
};
