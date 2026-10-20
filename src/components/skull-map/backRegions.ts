// Back-of-head and neck view, seen from behind: the patient's left is on the viewer's left.
// Regions are listed bottom layer first; later entries are painted on top (layered brushing).
export type MapRegion = { id: string; d: string; parent?: string };

export const BACK_VIEWBOX = '0 0 200 260';

export const BACK_OUTLINE =
  'M100 14 C150 14 178 52 178 104 C178 146 164 176 140 192 L136 214 C136 232 150 244 170 252 L30 252 C50 244 64 232 64 214 L60 192 C36 176 22 146 22 104 C22 52 50 14 100 14 Z';

export const BACK_REGIONS: MapRegion[] = [
  { id: 'crown', d: 'M100 14 C140 14 166 38 174 74 L26 74 C34 38 60 14 100 14 Z' },
  { id: 'l-occiput', d: 'M26 74 L100 74 L100 186 C80 186 70 184 60 192 C36 176 22 146 22 104 C22 92 23 82 26 74 Z' },
  { id: 'r-occiput', d: 'M100 74 L174 74 C177 82 178 92 178 104 C178 146 164 176 140 192 C130 184 120 186 100 186 Z' },
  { id: 'occiput', parent: 'crown', d: 'M100 104 C122 104 134 120 134 140 C134 160 120 172 100 172 C80 172 66 160 66 140 C66 120 78 104 100 104 Z' },
  { id: 'neck', d: 'M60 192 C70 184 80 186 100 186 C120 186 130 184 140 192 L136 214 C136 232 150 244 170 252 L30 252 C50 244 64 232 64 214 Z' },
];
