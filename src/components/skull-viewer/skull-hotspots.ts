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
  /** Stable area ID on the patient's own side (e.g. temple_left). */
  areaKey: string;
  /** Side-view hotspots: final key gets the chosen side appended (e.g. jaw_left). */
  sided?: boolean;
}

export type SkullView = 'front' | 'side' | 'back';

export const SKULL_IMAGES = {
  front: '/lovable-uploads/c5a5c01e-5749-4190-89d4-d98341af6eae.png',
  side: '/lovable-uploads/c5e889bd-aa9a-4ea4-bb79-cb37aa082b87.png',
  back: '/lovable-uploads/15169a8c-c348-405f-9910-083fd38b7517.png',
};

export const SKULL_HOTSPOTS: Hotspot[] = [
  // FRONT
  { id: 'front-pressure-band', areaKey: 'pressure_band', x: 50, y: 30, size: 75, title: 'Pressure Band', description: 'A horizontal band across the forehead.', view: 'front' },
  { id: 'front-forehead-middle', areaKey: 'forehead_center', x: 50, y: 40, size: 14, title: 'Middle of the Forehead', description: 'Central point above the eyebrows.', view: 'front' },
  { id: 'front-forehead-left', areaKey: 'forehead_right', x: 32, y: 40, size: 12, title: 'Right Forehead', description: 'Right section of the forehead.', view: 'front' },
  { id: 'front-eye-left', areaKey: 'eye_right', x: 30, y: 50, size: 18, title: 'Right Eye', description: 'Right eye socket.', view: 'front' },
  { id: 'front-forehead-right', areaKey: 'forehead_left', x: 68, y: 40, size: 12, title: 'Left Forehead', description: 'Left section of the forehead.', view: 'front' },
  { id: 'front-eye-right', areaKey: 'eye_left', x: 70, y: 50, size: 18, title: 'Left Eye', description: 'Left eye socket.', view: 'front' },
  { id: 'front-temple-left', areaKey: 'temple_right', x: 8, y: 36, size: 15, title: 'Right Temple', description: 'Right temple area.', view: 'front' },
  { id: 'front-temple-right', areaKey: 'temple_left', x: 92, y: 36, size: 15, title: 'Left Temple', description: 'Left temple area.', view: 'front' },
  { id: 'front-half-face-left', areaKey: 'half_face_right', x: 32, y: 55, size: 65, title: 'Right Half of Face', description: 'Entire right half of the face.', view: 'front' },
  { id: 'front-half-face-right', areaKey: 'half_face_left', x: 70, y: 55, size: 65, title: 'Left Half of Face', description: 'Entire left half of the face.', view: 'front' },
  { id: 'front-upper-sinus-left', areaKey: 'upper_sinus_right', x: 43, y: 50, size: 8, title: 'Right Upper Sinus', description: 'Upper sinus on the right.', view: 'front' },
  { id: 'front-upper-sinus-right', areaKey: 'upper_sinus_left', x: 57, y: 50, size: 8, title: 'Left Upper Sinus', description: 'Upper sinus on the left.', view: 'front' },
  { id: 'front-lower-sinus-left', areaKey: 'lower_sinus_right', x: 42, y: 57, size: 7, title: 'Right Lower Sinus', description: 'Lower sinus on the right.', view: 'front' },
  { id: 'front-lower-sinus-right', areaKey: 'lower_sinus_left', x: 58, y: 58, size: 7, title: 'Left Lower Sinus', description: 'Lower sinus on the left.', view: 'front' },
  // SIDE
  {
    id: 'side-temple',
    areaKey: 'temple',
    sided: true,
    x: 50,
    y: 50,
    size: 22,
    title: 'Temple',
    description: 'Side temple area, over the ear.',
    view: 'side',
  },
  {
    id: 'side-back-head',
    areaKey: 'parietal',
    sided: true,
    x: 75,
    y: 30,
    size: 25,
    title: 'Parietal',
    description: 'Parietal region of the skull.',
    view: 'side',
  },
  {
    id: 'side-jaw',
    areaKey: 'jaw',
    sided: true,
    x: 42,
    y: 75,
    size: 20,
    title: 'Jaw',
    description: 'Anatomical jaw, positioned behind last tooth.',
    view: 'side',
  },
  {
    id: 'side-neck',
    areaKey: 'occipital',
    sided: true,
    x: 80,
    y: 68,
    size: 18,
    title: 'Occiput',
    description: 'Occipital base of the skull.',
    view: 'side',
  },
  {
    id: 'side-pressure-band',
    areaKey: 'pressure_band',
    x: 50,
    y: 30,
    size: 75,
    title: 'Pressure Band',
    description: 'Horizontal pressure band from side view.',
    view: 'side',
  },
  // BACK
  { id: 'back-occiput', areaKey: 'occipital_center', x: 50, y: 55, size: 28, title: 'Occipital Area', description: 'Center occipital region.', view: 'back' },
  { id: 'back-top', areaKey: 'crown', x: 50, y: 20, size: 19, title: 'Crown of Head', description: 'Top/crown of the skull.', view: 'back' },
  { id: 'back-base', areaKey: 'skull_base', x: 50, y: 95, size: 18, title: 'Base of Head', description: 'Base of the skull (nape area).', view: 'back' },
  { id: 'back-occiput-left', areaKey: 'occipital_left', x: 28, y: 57, size: 13, title: 'Left Occipital Area', description: 'Left side of the occiput.', view: 'back' },
  { id: 'back-occiput-right', areaKey: 'occipital_right', x: 72, y: 57, size: 13, title: 'Right Occipital Area', description: 'Right side of the occiput.', view: 'back' },
  { id: 'back-pressure-band', areaKey: 'pressure_band', x: 50, y: 30, size: 75, title: 'Pressure Band', description: 'Horizontal pressure band from the back view.', view: 'back' },
];

/** Resolve the stable area key for a hotspot, using the chosen side for side-view areas. */
export function resolveAreaKey(hotspot: Hotspot, side: 'left' | 'right'): string {
  return hotspot.sided ? `${hotspot.areaKey}_${side}` : hotspot.areaKey;
}

const SIDED_BASE_LABELS: Record<string, string> = {
  temple: 'Temple',
  parietal: 'Parietal',
  jaw: 'Jaw',
  occipital: 'Occipital Area',
};

/** Human-readable label for a stable area key. */
export function getAreaLabel(key: string): string {
  const direct = SKULL_HOTSPOTS.find((h) => !h.sided && h.areaKey === key);
  if (direct) return direct.title;
  const m = key.match(/^(.+)_(left|right)$/);
  if (m && SIDED_BASE_LABELS[m[1]]) {
    return `${m[2] === 'left' ? 'Left' : 'Right'} ${SIDED_BASE_LABELS[m[1]]}`;
  }
  return key;
}

/** Best-effort key for a legacy row that only stored a name. Returns null when ambiguous. */
export function areaKeyFromLabel(label: string): string | null {
  const h = SKULL_HOTSPOTS.find((x) => !x.sided && x.title === label);
  if (h) return h.areaKey;
  const m = label.match(/^(Left|Right) (.+)$/);
  if (m) {
    const base = Object.entries(SIDED_BASE_LABELS).find(([, l]) => l === m[2])?.[0];
    if (base) return `${base}_${m[1].toLowerCase()}`;
  }
  return null;
}
