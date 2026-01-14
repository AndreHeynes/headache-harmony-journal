
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

  // Determine visual state colors - increased visibility
  const getBackgroundStyle = () => {
    if (isSelected) {
      return 'rgba(59, 130, 246, 0.5)'; // More opaque blue when selected
    }
    if (showTooltip) {
      return 'rgba(59, 130, 246, 0.35)'; // Semi-transparent blue on hover
    }
    return 'rgba(59, 130, 246, 0.18)'; // More visible when idle
  };

  const getBorderStyle = () => {
    if (isSelected) {
      return '3px solid rgba(59, 130, 246, 0.95)';
    }
    if (showTooltip) {
      return '2px solid rgba(59, 130, 246, 0.7)';
    }
    return '2px solid rgba(59, 130, 246, 0.5)'; // Solid border, more visible
  };

  const getBoxShadow = () => {
    if (isSelected) {
      return '0 0 12px rgba(59, 130, 246, 0.5), inset 0 0 8px rgba(59, 130, 246, 0.2)';
    }
    if (showTooltip) {
      return '0 0 8px rgba(59, 130, 246, 0.3)';
    }
    return 'none';
  };

  return (
    <>
      <div
        className="absolute cursor-pointer transition-all duration-200"
        style={{
          left: `${hotspot.x}%`,
          top: `${hotspot.y}%`,
          width: dimensions.width,
          height: dimensions.height,
          transform: `translate(-50%, -50%) ${showTooltip && !isSelected ? 'scale(1.05)' : 'scale(1)'}`,
          background: getBackgroundStyle(),
          border: getBorderStyle(),
          boxShadow: getBoxShadow(),
          zIndex: getHotspotZIndex(hotspot),
          borderRadius: dimensions.borderRadius,
          backdropFilter: isSelected || showTooltip ? 'blur(1px)' : 'none',
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
          className="absolute pointer-events-none animate-pulse"
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: getHotspotZIndex(hotspot) + 1,
          }}
        >
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
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
