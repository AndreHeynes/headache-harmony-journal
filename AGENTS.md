# Project rules

- All statistics (Dashboard stats, Analysis, Export, AI report) count only completed episodes via `src/lib/analysis.ts` (`ANALYSIS_EPISODE_STATUS`); why: one consistent rule shown to users.
- Analyses read per-area data through `buildAnalysisUnits` (area value, else episode value); the AI report edge function mirrors this logic inline; why: multi-area episodes must not be reduced to episode-level fields.
- Skull areas are identified by stable patient-side `areaKey`s (`skull-hotspots.ts`), stored in `episode_locations.location_key`; why: names alone merged left/right on the side view.
- `episode_locations` rows are never deleted on reselection; unselected areas get `deselected_at` and are restored if reselected; queries must filter `deselected_at is null`; why: keep per-area details.
- Effectiveness rate excludes uses with no recorded outcome; why: no guessing from duration.
- Tests run with `bun run test` (vitest) in `src/**/__tests__`.
- Area origin = `episode_locations.selection_order = 1` while selected; numbers are assigned by a DB insert trigger and locked on update (gaps kept, never renumbered); `is_origin` is written only for older readers; why: a stable per-episode spread order.
- Standard PDF/CSV export never uses sample data and is blocked until the user has at least one completed episode (`canExport` in `src/lib/exportFormat.ts`); sample rows are preview-only; why: downloaded medical reports must contain only real data.
- Beta Premium window is computed only from `profiles.premium_expires_at` via `src/lib/betaStatus.ts`; tier/expiry are protected from user edits by a DB trigger; why: one source for badge and AI gating.
- Public trial drafts stay in sessionStorage and save only with explicit authenticated consent as active episodes; why: avoid anonymous health-data writes and bypassing required screening.
- Public sample fixtures are separate from Standard Export, and every sample PDF is labelled fictional; why: keep patient reports real-data-only.
- PDF QR codes contain only the public clinician reference URL, never health data or report access tokens; why: sharing must not expose patient records.
- Campaign tracking (`src/lib/campaignTracking.ts`, table `campaign_events`) stores only tag values, page, step and a per-tab random id — never user ids, emails or health data; results visible only to admins at /post-results; why: measure posts without tracking people.
- Pages open to visitors are listed once in `src/lib/publicRoutes.ts` (`PUBLIC_PATHS`, `POST_SIGNIN_ENTRY_PATHS`); the beta gate and the post-signin redirect both read it; why: signup consent links to /policy so it must be readable before an account exists, and a signed-in reader must not be yanked to the dashboard from a page they opened.

- Demo screens (/demo) use in-memory fictional fixtures from `src/lib/demoScenarios.ts` and never read or write the database; why: marketing captures must never touch real user data.
- Real-screen `?demo=1` installs a tab-scoped in-memory request gateway before rendering and supplies a fictional user; every backend/function request must stay inside that adapter, with deterministic weather/cycle fixtures and no geolocation or real-session checks; why: protected production screens can be captured without accounts, network health data, or mutations.
- `?capture=1` (`src/lib/captureMode.ts`) hides floating UI for screenshots, tab-scoped; why: clean marketing captures without changing normal use.
