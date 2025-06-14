
export const SKULL_IMAGES = {
  front: '/lovable-uploads/f6987888-0500-4d98-98c2-e497abfc42fd.png',
  side: '/lovable-uploads/cd0a6969-7b67-43a8-95a6-3ce645f89bb8.png',
  back: '/lovable-uploads/a1d7214d-d71a-42ef-87ee-e0df5339fdab.png',
};

export interface HotspotData {
  id: string;
  name: string;
  x: number;
  y: number;
  view: 'front' | 'side' | 'back';
}

export const SKULL_HOTSPOTS: HotspotData[] = [
  // Front view hotspots
  { id: 'forehead', name: 'Forehead', x: 50, y: 25, view: 'front' },
  { id: 'left-temple', name: 'Left Temple', x: 20, y: 40, view: 'front' },
  { id: 'right-temple', name: 'Right Temple', x: 80, y: 40, view: 'front' },
  { id: 'left-eye', name: 'Left Eye Area', x: 35, y: 45, view: 'front' },
  { id: 'right-eye', name: 'Right Eye Area', x: 65, y: 45, view: 'front' },
  { id: 'nose-bridge', name: 'Nose Bridge', x: 50, y: 50, view: 'front' },
  { id: 'left-cheek', name: 'Left Cheek', x: 30, y: 60, view: 'front' },
  { id: 'right-cheek', name: 'Right Cheek', x: 70, y: 60, view: 'front' },
  { id: 'upper-jaw', name: 'Upper Jaw', x: 50, y: 70, view: 'front' },
  { id: 'lower-jaw', name: 'Lower Jaw', x: 50, y: 80, view: 'front' },

  // Side view hotspots
  { id: 'frontal-side', name: 'Frontal Area', x: 15, y: 25, view: 'side' },
  { id: 'parietal-side', name: 'Parietal Area', x: 35, y: 20, view: 'side' },
  { id: 'temporal-side', name: 'Temporal Area', x: 25, y: 40, view: 'side' },
  { id: 'occipital-side', name: 'Occipital Area', x: 55, y: 25, view: 'side' },
  { id: 'mastoid-side', name: 'Mastoid Area', x: 45, y: 50, view: 'side' },
  { id: 'jaw-joint-side', name: 'TMJ Area', x: 35, y: 55, view: 'side' },
  { id: 'neck-side', name: 'Neck Connection', x: 40, y: 75, view: 'side' },

  // Back view hotspots
  { id: 'occipital-back', name: 'Occipital Area', x: 50, y: 30, view: 'back' },
  { id: 'left-parietal-back', name: 'Left Parietal', x: 35, y: 25, view: 'back' },
  { id: 'right-parietal-back', name: 'Right Parietal', x: 65, y: 25, view: 'back' },
  { id: 'left-temporal-back', name: 'Left Temporal', x: 25, y: 40, view: 'back' },
  { id: 'right-temporal-back', name: 'Right Temporal', x: 75, y: 40, view: 'back' },
  { id: 'suboccipital', name: 'Suboccipital', x: 50, y: 50, view: 'back' },
  { id: 'upper-neck-back', name: 'Upper Neck', x: 50, y: 70, view: 'back' },
  { id: 'left-neck-back', name: 'Left Neck', x: 40, y: 75, view: 'back' },
  { id: 'right-neck-back', name: 'Right Neck', x: 60, y: 75, view: 'back' },
];
