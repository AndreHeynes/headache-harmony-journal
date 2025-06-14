
export const SKULL_IMAGES = {
  front: '/lovable-uploads/f6987888-0500-4d98-98c2-e497abfc42fd.png',
  side: '/lovable-uploads/cd0a6969-7b67-43a8-95a6-3ce645f89bb8.png',
  back: '/lovable-uploads/a1d7214d-d71a-42ef-87ee-e0df5339fdab.png',
};

export type SkullView = 'front' | 'side' | 'back';

export interface Hotspot {
  id: string;
  name: string;
  x: number;
  y: number;
  view: SkullView;
  size: number;
}

export const SKULL_HOTSPOTS: Hotspot[] = [
  // Front view hotspots
  { id: 'forehead', name: 'Forehead', x: 50, y: 25, view: 'front', size: 16 },
  { id: 'left-temple', name: 'Left Temple', x: 20, y: 40, view: 'front', size: 16 },
  { id: 'right-temple', name: 'Right Temple', x: 80, y: 40, view: 'front', size: 16 },
  { id: 'left-eye', name: 'Left Eye Area', x: 35, y: 45, view: 'front', size: 14 },
  { id: 'right-eye', name: 'Right Eye Area', x: 65, y: 45, view: 'front', size: 14 },
  { id: 'nose-bridge', name: 'Nose Bridge', x: 50, y: 50, view: 'front', size: 12 },
  { id: 'left-cheek', name: 'Left Cheek', x: 30, y: 60, view: 'front', size: 14 },
  { id: 'right-cheek', name: 'Right Cheek', x: 70, y: 60, view: 'front', size: 14 },
  { id: 'upper-jaw', name: 'Upper Jaw', x: 50, y: 70, view: 'front', size: 16 },
  { id: 'lower-jaw', name: 'Lower Jaw', x: 50, y: 80, view: 'front', size: 16 },

  // Side view hotspots
  { id: 'frontal-side', name: 'Frontal Area', x: 15, y: 25, view: 'side', size: 16 },
  { id: 'parietal-side', name: 'Parietal Area', x: 35, y: 20, view: 'side', size: 16 },
  { id: 'temporal-side', name: 'Temporal Area', x: 25, y: 40, view: 'side', size: 16 },
  { id: 'occipital-side', name: 'Occipital Area', x: 55, y: 25, view: 'side', size: 16 },
  { id: 'mastoid-side', name: 'Mastoid Area', x: 45, y: 50, view: 'side', size: 14 },
  { id: 'jaw-joint-side', name: 'TMJ Area', x: 35, y: 55, view: 'side', size: 14 },
  { id: 'neck-side', name: 'Neck Connection', x: 40, y: 75, view: 'side', size: 14 },

  // Back view hotspots
  { id: 'occipital-back', name: 'Occipital Area', x: 50, y: 30, view: 'back', size: 16 },
  { id: 'left-parietal-back', name: 'Left Parietal', x: 35, y: 25, view: 'back', size: 16 },
  { id: 'right-parietal-back', name: 'Right Parietal', x: 65, y: 25, view: 'back', size: 16 },
  { id: 'left-temporal-back', name: 'Left Temporal', x: 25, y: 40, view: 'back', size: 16 },
  { id: 'right-temporal-back', name: 'Right Temporal', x: 75, y: 40, view: 'back', size: 16 },
  { id: 'suboccipital', name: 'Suboccipital', x: 50, y: 50, view: 'back', size: 16 },
  { id: 'upper-neck-back', name: 'Upper Neck', x: 50, y: 70, view: 'back', size: 14 },
  { id: 'left-neck-back', name: 'Left Neck', x: 40, y: 75, view: 'back', size: 14 },
  { id: 'right-neck-back', name: 'Right Neck', x: 60, y: 75, view: 'back', size: 14 },
];

export const getHotspotZIndex = (hotspot: Hotspot): number => {
  // Smaller hotspots get higher z-index so they appear on top
  return 100 - hotspot.size;
};

export const isPressureBand = (hotspotId: string): boolean => {
  return ['forehead', 'left-temple', 'right-temple'].includes(hotspotId);
};

export const isHalfFace = (hotspotId: string): boolean => {
  return hotspotId.includes('left-') || hotspotId.includes('right-');
};
