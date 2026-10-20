# Project rules

- All statistics (Dashboard stats, Analysis, Export, AI report) count only completed episodes via `src/lib/analysis.ts` (`ANALYSIS_EPISODE_STATUS`); why: one consistent rule shown to users.
- Analyses read per-area data through `buildAnalysisUnits` (area value, else episode value); the AI report edge function mirrors this logic inline; why: multi-area episodes must not be reduced to episode-level fields.
- Skull areas are identified by stable patient-side `areaKey`s (`skull-hotspots.ts`), stored in `episode_locations.location_key`; why: names alone merged left/right on the side view.
- `episode_locations` rows are never deleted on reselection; unselected areas get `deselected_at` and are restored if reselected; queries must filter `deselected_at is null`; why: keep per-area details.
- Effectiveness rate excludes uses with no recorded outcome; why: no guessing from duration.
- Tests run with `bun run test` (vitest) in `src/**/__tests__`.
- Area origin = `episode_locations.selection_order = 1` while selected; numbers are assigned by a DB insert trigger and locked on update (gaps kept, never renumbered); `is_origin` is written only for older readers; why: a stable per-episode spread order.
