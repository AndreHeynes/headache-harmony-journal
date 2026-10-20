// Maps stored skull area keys (old map) to region IDs of the new SVG map.
// Stored rows are never rewritten; this mapping is applied on read and in the region_id backfill.

export const REGION_LABELS: Record<string, string> = {
  crown: 'Top of head', forehead: 'Forehead', 'r-side': 'Right side of head', 'l-side': 'Left side of head',
  'r-face': 'Right half of face', 'l-face': 'Left half of face', vertex: 'Vertex', 'mid-forehead': 'Mid forehead',
  'r-brow': 'Right brow', 'l-brow': 'Left brow', 'r-eye': 'Right eye', 'l-eye': 'Left eye',
  'r-temple': 'Right temple', 'l-temple': 'Left temple', nasal: 'Nasal bridge',
  'r-sinus': 'Right sinus / cheek', 'l-sinus': 'Left sinus / cheek', 'r-tmj': 'Right jaw joint', 'l-tmj': 'Left jaw joint',
  teeth: 'Teeth', 'r-jaw': 'Right jaw', 'l-jaw': 'Left jaw',
  occiput: 'Back of head', 'r-occiput': 'Right back of head', 'l-occiput': 'Left back of head',
  neck: 'Neck / base of skull',
};

/** Old area key -> new region ID. Keys absent here (pressure_band) stay legacy-only areas. */
export const LEGACY_TO_REGION: Record<string, string> = {
  forehead_center: 'mid-forehead',
  forehead_left: 'l-brow', forehead_right: 'r-brow',
  eye_left: 'l-eye', eye_right: 'r-eye',
  temple_left: 'l-temple', temple_right: 'r-temple',
  half_face_left: 'l-face', half_face_right: 'r-face',
  upper_sinus_left: 'l-sinus', upper_sinus_right: 'r-sinus',
  lower_sinus_left: 'l-sinus', lower_sinus_right: 'r-sinus',
  parietal_left: 'l-side', parietal_right: 'r-side',
  jaw_left: 'l-tmj', jaw_right: 'r-tmj',
  occipital_center: 'occiput',
  occipital_left: 'l-occiput', occipital_right: 'r-occiput',
  crown: 'crown',
  skull_base: 'neck',
};

/** Legacy rows without a key whose name still resolves to one region. */
const LEGACY_NAME_TO_REGION: Record<string, string> = { Occiput: 'occiput', 'Occipital Area': 'occiput' };

export const REGION_KEY_PREFIX = 'region:';

export type ResolvedArea = { id: string; label: string; legacy: boolean };

/** Resolve a stored area row to its new region, or a legacy area that keeps its original name. */
export function resolveRegion(row: { region_id?: string | null; location_key?: string | null; location_name: string }): ResolvedArea {
  const key = row.location_key ?? '';
  const id =
    row.region_id ??
    (key.startsWith(REGION_KEY_PREFIX) ? key.slice(REGION_KEY_PREFIX.length) : LEGACY_TO_REGION[key]) ??
    LEGACY_NAME_TO_REGION[row.location_name];
  if (id && REGION_LABELS[id]) return { id, label: REGION_LABELS[id], legacy: false };
  return { id: `legacy:${key || row.location_name}`, label: row.location_name, legacy: true };
}
