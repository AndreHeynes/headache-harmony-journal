// All types and hotspot data in one place

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  size: number;
  title: string;
  description: string;
  view: 'front' | 'side' | 'back';
  zIndex?: number;
}

export type SkullView = 'front' | 'side' | 'back';

export const SKULL_IMAGES = {
  front: '/lovable-uploads/c5a5c01e-5749-4190-89d4-d98341af6eae.png',
  side: '/lovable-uploads/c5e889bd-aa9a-4ea4-bb79-cb37aa082b87.png',
  back: '/lovable-uploads/15169a8c-c348-405f-9910-083fd38b7517.png',
};

export const SKULL_HOTSPOTS: Hotspot[] = [
  // FRONT
  { id: 'side-pressure-band', x: 50, y: 30, size: 75, title: 'Pressure Band', description: 'A horizontal band across the forehead.', view: 'front' },
  { id: 'front-forehead-middle', x: 50, y: 40, size: 14, title: 'Middle of the Forehead', description: 'Central point above the eyebrows.', view: 'front' },
  { id: 'front-forehead-left', x: 32, y: 40, size: 12, title: 'Right Forehead', description: 'Right section of the forehead.', view: 'front' },
  { id: 'front-eye-left', x: 30, y: 50, size: 18, title: 'Right Eye', description: 'Right eye socket.', view: 'front' },
  { id: 'front-forehead-right', x: 68, y: 40, size: 12, title: 'Left Forehead', description: 'Left section of the forehead.', view: 'front' },
  { id: 'front-eye-right', x: 70, y: 50, size: 18, title: 'Left Eye', description: 'Left eye socket.', view: 'front' },
  { id: 'front-temple-left', x: 8, y: 36, size: 15, title: 'Right Temple', description: 'Right temple area.', view: 'front' },
  { id: 'front-temple-right', x: 92, y: 36, size: 15, title: 'Left Temple', description: 'Left temple area.', view: 'front' },
  { id: 'front-half-face-left', x: 32, y: 55, size: 65, title: 'Right Half of Face', description: 'Entire right half of the face.', view: 'front' },
  { id: 'front-half-face-right', x: 70, y: 55, size: 65, title: 'Left Half of Face', description: 'Entire left half of the face.', view: 'front' },
  { id: 'front-upper-sinus-left', x: 43, y: 50, size: 8, title: 'Right Upper Sinus', description: 'Upper sinus on the right.', view: 'front' },
  { id: 'front-upper-sinus-right', x: 57, y: 50, size: 8, title: 'Left Upper Sinus', description: 'Upper sinus on the left.', view: 'front' },
  { id: 'front-lower-sinus-left', x: 42, y: 57, size: 7, title: 'Right Lower Sinus', description: 'Lower sinus on the right.', view: 'front' },
  { id: 'front-lower-sinus-right', x: 58, y: 58, size: 7, title: 'Left Lower Sinus', description: 'Lower sinus on the left.', view: 'front' },
  // SIDE
  {
    id: 'side-temple',
    x: 50,
    y: 50,
    size: 22,
    title: 'Temple',
    description: 'Side temple area, over the ear.',
    view: 'side',
  },
  {
    id: 'side-back-head',
    x: 75,
    y: 30,
    size: 25,
    title: 'Parietal',
    description: 'Parietal region of the skull.',
    view: 'side',
  },
  {
    id: 'side-jaw',
    x: 42,
    y: 75,
    size: 20,
    title: 'Jaw',
    description: 'Anatomical jaw, positioned behind last tooth.',
    view: 'side',
  },
  {
    id: 'side-neck',
    x: 80,
    y: 68,
    size: 18,
    title: 'Occiput',
    description: 'Occipital base of the skull.',
    view: 'side',
  },
  {
    id: 'side-pressure-band',
    x: 50,
    y: 30,
    size: 75,
    title: 'Pressure Band',
    description: 'Horizontal pressure band from side view.',
    view: 'side',
  },
  // BACK
  { id: 'back-occiput', x: 50, y: 55, size: 28, title: 'Occipital Area', description: 'Center occipital region.', view: 'back' },
  { id: 'back-top', x: 50, y: 20, size: 19, title: 'Crown of Head', description: 'Top/crown of the skull.', view: 'back' },
  { id: 'back-base', x: 50, y: 95, size: 18, title: 'Base of Head', description: 'Base of the skull (nape area).', view: 'back' },
  { id: 'back-occiput-left', x: 28, y: 57, size: 13, title: 'Left Occipital Area', description: 'Left side of the occiput.', view: 'back' },
  { id: 'back-occiput-right', x: 72, y: 57, size: 13, title: 'Right Occipital Area', description: 'Right side of the occiput.', view: 'back' },
  { id: 'back-pressure-band', x: 50, y: 30, size: 75, title: 'Pressure Band', description: 'Horizontal pressure band from the back view.', view: 'back' },
];
