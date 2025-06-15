
import { Hotspot } from './skull-hotspots';

export const getHotspotZIndex = (hotspot: Hotspot) => {
  if (hotspot.id.includes('half-face')) return 800;
  if (hotspot.id.includes('pressure-band')) return 850;
  if (hotspot.id.includes('forehead')) return 900;
  if (hotspot.id.includes('eye') || hotspot.id.includes('temple')) return 950;
  return 800;
};

export const isPressureBand = (id: string) => id.includes('pressure-band');
export const isHalfFace = (id: string) => id.includes('half-face');

export const getHotspotDimensions = (hotspot: Hotspot) => {
  const isP = isPressureBand(hotspot.id);
  const isH = isHalfFace(hotspot.id);
  
  return {
    width: isP ? `${hotspot.size}%` : isH ? `${hotspot.size * 0.6}%` : `${hotspot.size}%`,
    height: isP ? `${hotspot.size * 0.15}%` : isH ? `${hotspot.size * 1.2}%` : `${hotspot.size}%`,
    borderRadius: isP ? '50px' : isH ? '8px' : '50%'
  };
};

export const getDisplayTitle = (hotspot: Hotspot, selectedSide?: 'left' | 'right') => {
  if (hotspot.view === 'side' && selectedSide) {
    const title = hotspot.title;
    if (!title.toLowerCase().includes('left') && !title.toLowerCase().includes('right')) {
      return `${selectedSide === 'left' ? 'Left' : 'Right'} ${title}`;
    }
  }
  return hotspot.title;
};
