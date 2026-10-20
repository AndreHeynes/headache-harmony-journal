# Replace the Journal skull map with the Headache Mapping Journal design

Scoping plan only. Nothing is built until the decisions below are answered.

## What is coming over

The new design is one front-facing SVG with 24 regions, named from the patient's own side:

- Broad (6): crown, forehead, r-side, l-side, r-face, l-face
- Detailed (16, painted on top of a broad parent): vertex, mid-forehead, r/l-brow, r/l-eye, r/l-temple, nasal, r/l-sinus, r/l-tmj (jaw joint), teeth, r/l-jaw
- Hidden (2, no drawing yet): occiput ("Back of head"), neck ("Neck / base of skull")

Layered brushing lets a detailed region be painted over its broad parent. The current Journal's tap/tab flow, per-area details (intensity, symptoms, triggers, treatment, timing, outcome) and per-episode selection order stay exactly as they are; only the picture and the area IDs change.

## 1. Saved-episode migration

Stored data is never rewritten or deleted. Each area row keeps its current area key and name. A new region field is added and filled from a fixed mapping; the app reads the region field and falls back to the old key.

| Current area key | New region | Match |
|---|---|---|
| forehead_center | mid-forehead | exact |
| forehead_left / forehead_right | forehead | broad, side lost (decision D3) |
| eye_left / eye_right | l-eye / r-eye | exact |
| temple_left / temple_right (front and side view) | l-temple / r-temple | exact |
| half_face_left / half_face_right | l-face / r-face | exact |
| upper_sinus_left / _right | l-sinus / r-sinus | close (or nasal, D3) |
| lower_sinus_left / _right | l-sinus / r-sinus | close |
| parietal_left / _right | l-side / r-side | close |
| jaw_left / jaw_right ("behind last tooth") | l-tmj / r-tmj | close (or l/r-jaw, D3) |
| occipital_center | occiput | exact |
| occipital_left / _right | occiput | side lost unless a back view exists (D1) |
| crown | crown | exact |
| skull_base | neck | close |
| pressure_band | no single region | see below |
| Legacy rows with no key (unsided "Temple", "Parietal", "Occiput") | the side-less region where one exists (occiput), otherwise unmapped | |

Keys with no match (pressure band, unresolvable legacy rows):
- Kept as their own "legacy area", shown with the original name ("Pressure Band") on old episodes, in the breakdown and in exports, and still counted in every analysis.
- Not offered on the new map for new episodes, unless you choose a replacement (D2).
- If two old areas in one episode map to the same new region (e.g. temple_left from front and side view), both rows are kept; analysis counts the region once per episode using the lower selection order.

Selection order, first-selected time and the "deselected" state are untouched, so every saved episode opens with the same order numbers.

## 2. Labels and analysis

One mapping module becomes the only place that turns a stored row into a region ID and a label. Everything reads through it:
- Area tab names ("1 · Left temple") and the pain-location step, which restores saved selections on the new map
- Dashboard location breakdown (grouped by new region; broad/detailed rolled up to the broad parent as an option)
- Area order card (first area, by-order rank, spread timing)
- Correlation engine, detailed insights, medication analysis, neck-pain insights (neck/occiput regions)
- Standard PDF/CSV export (CSV gains a region ID column next to the existing area key) and the AI report function, which gets the same mapping inline as it does today
- The old episode-level location text stays written for older screens

## 3. Testing

- Automated checks: one per mapping rule (every current key resolves; side kept; unmatched keys stay counted; duplicate-region rule; selection order unchanged).
- Signed-in end-to-end run on phone (390 wide) and desktop (1280 wide) using existing saved episodes: open old episodes, confirm areas, order numbers and details; log a new multi-area episode with layered brushing; unselect/reselect; check Dashboard, Analysis, Area order and both exports.
- Your journal currently has no completed episodes, so test episodes must be created first (D5). The switch is not called done until this run passes on both sizes.

## Decisions needed from you

- D1. Must the back-of-head and neck view be drawn before the swap? Without it, occiput and neck are only pickable from a list, and left/right occipital merge into one "Back of head" for new episodes.
- D2. Pressure band: keep as a legacy-only area, or map new selections to forehead + both sides of head?
- D3. Close-match choices: forehead left/right to broad forehead (side lost) or to the matching brow; upper sinus to sinus or nasal bridge; jaw to jaw joint or jaw.
- D4. Should the side view be dropped entirely (front-only map), with side-view areas reached through the matches above?
- D5. May I create a few test episodes in your account for the end-to-end run, and remove them afterwards?

## Technical details

- Migration (additive): nullable `region_id text` on `episode_locations`, backfilled with a CASE on `location_key`; comment marks it as the new ID. No column or row removed; `location_key` stays authoritative for history.
- New `src/lib/regions.ts` (copied geometry) + `src/lib/regionMapping.ts` (`LEGACY_TO_REGION`, `resolveRegion(row)`, `getRegionLabel`). New writes set both `region_id` and `location_key` (new rows use the region ID as key with a `region:` prefix to avoid the "crown" clash).
- Replace `SkullViewer`/`skull-viewer/*` with a `SkullCanvas`-based component keeping the same `onSelectionChange(keys)` contract, so `LogPainLocation` and `LocationContext` change minimally.
- Update `analysis.ts` (`buildAnalysisUnits`, area-order functions), `useDashboardData`, `useDetailedInsights`, `useExportData`, `exportFormat.ts`, `LocationTabs`, the generate-ai-report function, and tests in `src/lib/__tests__`.
- Record the region-ID rule in AGENTS.md, replacing the current area-key rule.
