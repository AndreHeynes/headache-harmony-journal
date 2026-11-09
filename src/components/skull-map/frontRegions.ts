// Front view, facing the patient: the patient's right is on the viewer's left.
// Anatomical vectors from the Headache Mapping Journal design (viewBox 0 0 400 500).
// Broad regions first, detailed regions after (painted on top = layered brushing).
import type { MapRegion } from './backRegions';

export const FRONT_VIEWBOX = '0 0 400 500';

export const FRONT_OUTLINE =
  'M200 12 C298 12 354 80 354 170 C354 212 346 240 336 260 C348 278 346 302 326 314 C320 342 306 364 290 382 C280 422 254 458 222 470 C210 474 190 474 178 470 C146 458 120 422 110 382 C94 364 80 342 74 314 C54 302 52 278 64 260 C54 240 46 212 46 170 C46 80 102 12 200 12Z';

const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;
const rect = (x1: number, y1: number, x2: number, y2: number) => `M${x1} ${y1} L${x2} ${y1} L${x2} ${y2} L${x1} ${y2}Z`;

export const FRONT_REGIONS: MapRegion[] = [
  // Broad — together they tile the skull (clipped to the outline)
  { id: 'crown', d: rect(0, 0, 400, 100) },
  { id: 'forehead', d: rect(112, 100, 288, 182) },
  { id: 'r-side', d: rect(0, 100, 112, 182) },
  { id: 'l-side', d: rect(288, 100, 400, 182) },
  { id: 'r-face', d: rect(0, 182, 200, 500) },
  { id: 'l-face', d: rect(200, 182, 400, 500) },
  // Detailed
  { id: 'vertex', parent: 'crown', d: ell(200, 62, 95, 40) },
  { id: 'mid-forehead', parent: 'forehead', d: ell(200, 140, 72, 34) },
  { id: 'r-brow', parent: 'forehead', d: 'M100 196 Q140 178 188 194 L186 208 Q140 196 104 212Z' },
  { id: 'l-brow', parent: 'forehead', d: 'M300 196 Q260 178 212 194 L214 208 Q260 196 296 212Z' },
  { id: 'r-temple', parent: 'r-side', d: 'M48 186 L102 192 Q96 240 98 282 L66 272 Q50 240 48 186Z' },
  { id: 'l-temple', parent: 'l-side', d: 'M352 186 L298 192 Q304 240 302 282 L334 272 Q350 240 352 186Z' },
  { id: 'r-eye', parent: 'r-face', d: 'M108 222 C114 206 168 202 184 218 C192 238 184 268 160 274 C134 278 108 262 106 244Z' },
  { id: 'l-eye', parent: 'l-face', d: 'M292 222 C286 206 232 202 216 218 C208 238 216 268 240 274 C266 278 292 262 294 244Z' },
  { id: 'nasal', parent: 'r-face', d: 'M200 228 C190 260 178 300 180 330 Q200 340 220 330 C222 300 210 260 200 228Z' },
  { id: 'r-sinus', parent: 'r-face', d: 'M104 284 C130 280 168 284 178 300 C178 326 160 342 130 340 C110 336 100 312 104 284Z' },
  { id: 'l-sinus', parent: 'l-face', d: 'M296 284 C270 280 232 284 222 300 C222 326 240 342 270 340 C290 336 300 312 296 284Z' },
  { id: 'r-tmj', parent: 'r-side', d: ell(78, 300, 16, 26) },
  { id: 'l-tmj', parent: 'l-side', d: ell(322, 300, 16, 26) },
  { id: 'teeth', parent: 'r-face', d: 'M146 352 Q200 342 254 352 L250 404 Q200 414 150 404Z' },
  { id: 'r-jaw', parent: 'r-face', d: 'M90 340 L148 360 Q150 420 196 432 L196 476 C140 466 108 430 100 390Z' },
  { id: 'l-jaw', parent: 'l-face', d: 'M310 340 L252 360 Q250 420 204 432 L204 476 C260 466 292 430 300 390Z' },
];
