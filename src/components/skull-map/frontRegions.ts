// Front view, facing the patient: the patient's right is on the viewer's left.
// Broad regions first, detailed regions after (painted on top = layered brushing).
import type { MapRegion } from './backRegions';

export const FRONT_VIEWBOX = '0 0 200 260';

export const FRONT_OUTLINE =
  'M100 14 C150 14 178 50 178 110 C178 170 150 240 100 244 C50 240 22 170 22 110 C22 50 50 14 100 14 Z';

const e = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;

export const FRONT_REGIONS: MapRegion[] = [
  // Broad
  { id: 'crown', d: 'M30 50 C40 24 66 14 100 14 C134 14 160 24 170 50 Z' },
  { id: 'forehead', d: 'M46 50 L154 50 L154 98 L46 98 Z' },
  { id: 'r-side', d: 'M30 50 L46 50 L46 160 L26 160 C22 140 22 120 22 110 C22 84 25 64 30 50 Z' },
  { id: 'l-side', d: 'M154 50 L170 50 C175 64 178 84 178 110 C178 120 178 140 174 160 L154 160 Z' },
  { id: 'r-face', d: 'M46 98 L100 98 L100 244 C60 240 34 200 26 160 L46 160 Z' },
  { id: 'l-face', d: 'M100 98 L154 98 L154 160 L174 160 C166 200 140 240 100 244 Z' },
  // Detailed
  { id: 'vertex', parent: 'crown', d: e(100, 30, 18, 9) },
  { id: 'mid-forehead', parent: 'forehead', d: e(100, 68, 16, 11) },
  { id: 'r-brow', parent: 'forehead', d: e(70, 89, 18, 6) },
  { id: 'l-brow', parent: 'forehead', d: e(130, 89, 18, 6) },
  { id: 'r-temple', parent: 'r-side', d: e(36, 96, 10, 16) },
  { id: 'l-temple', parent: 'l-side', d: e(164, 96, 10, 16) },
  { id: 'r-eye', parent: 'r-face', d: e(70, 110, 15, 9) },
  { id: 'l-eye', parent: 'l-face', d: e(130, 110, 15, 9) },
  { id: 'nasal', parent: 'r-face', d: e(100, 118, 7, 14) },
  { id: 'r-sinus', parent: 'r-face', d: e(72, 138, 15, 10) },
  { id: 'l-sinus', parent: 'l-face', d: e(128, 138, 15, 10) },
  { id: 'r-tmj', parent: 'r-side', d: e(38, 150, 9, 10) },
  { id: 'l-tmj', parent: 'l-side', d: e(162, 150, 9, 10) },
  { id: 'teeth', parent: 'r-face', d: e(100, 184, 22, 8) },
  { id: 'r-jaw', parent: 'r-face', d: e(60, 206, 18, 11) },
  { id: 'l-jaw', parent: 'l-face', d: e(140, 206, 18, 11) },
];
