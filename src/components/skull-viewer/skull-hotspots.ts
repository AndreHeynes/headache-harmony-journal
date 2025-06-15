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
  front: '/lovable-uploads/04ae5d32-56c6-4985-a599-d6f4a495da9e.jpg',
  side: '/lovable-uploads/0b484054-55ef-4c66-9da2-a7898d965528.jpg',
  back: '/lovable-uploads/19c9e90e-130d-492e-802a-194bdbd5f739.jpg',
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
  { id: 'side-temple', x: 15, y: 40, size: 22, title: 'Temple', description: 'Side temple area.', view: 'side' },
  { id: 'side-ear', x: 50, y: 50, size: 25, title: 'Ear', description: 'Ear area.', view: 'side' },
  { id: 'side-forehead', x: 20, y: 30, size: 18, title: 'Forehead', description: 'Side view of the forehead.', view: 'side' },
  { id: 'side-crown', x: 30, y: 15, size: 20, title: 'Crown', description: 'Top of the head from side view.', view: 'side' },
  { id: 'side-back-head', x: 75, y: 30, size: 25, title: 'Back of Head', description: 'Posterior portion of the head.', view: 'side' },
  { id: 'side-jaw', x: 30, y: 70, size: 20, title: 'Jaw', description: 'Jaw area from side view.', view: 'side' },
  { id: 'side-neck', x: 80, y: 80, size: 18, title: 'Neck', description: 'Neck area from side view.', view: 'side' },
  { id: 'side-pressure-band', x: 50, y: 30, size: 75, title: 'Pressure Band', description: 'Horizontal pressure band from side view.', view: 'side' },
  // BACK
  { id: 'back-occiput', x: 50, y: 55, size: 28, title: 'Occipital Area', description: 'Center occipital region.', view: 'back' },
  { id: 'back-top', x: 50, y: 20, size: 19, title: 'Crown of Head', description: 'Top/crown of the skull.', view: 'back' },
  { id: 'back-base', x: 50, y: 95, size: 18, title: 'Base of Head', description: 'Base of the skull (nape area).', view: 'back' },
  { id: 'back-occiput-left', x: 28, y: 57, size: 13, title: 'Left Occipital Area', description: 'Left side of the occiput.', view: 'back' },
  { id: 'back-occiput-right', x: 72, y: 57, size: 13, title: 'Right Occipital Area', description: 'Right side of the occiput.', view: 'back' },
  { id: 'back-pressure-band', x: 50, y: 80, size: 75, title: 'Pressure Band', description: 'Horizontal pressure band from the back view.', view: 'back' },
];
