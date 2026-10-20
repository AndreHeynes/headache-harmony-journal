# Per-episode selection order for skull areas

Keep every existing field and the current tap/tab screens. Add a fixed order number and a first-selected time to each area in an episode, then use them in three new analysis views.

## Behaviour
- The first area tapped in an episode is 1, the next new area is 2, and so on. Each episode has its own numbering.
- A number never changes. Unselecting an area hides it (same as now) and leaves a gap. Reselecting it brings back the same row with the same number and the same first-selected time. No new row is created and nothing is renumbered.
- The first-selected time is recorded automatically when the row is created.
- "Origin" means the area numbered 1. The label only shows while area 1 is selected. If area 1 is unselected, no other area becomes origin.
- Area tabs show "1 · Left temple", "2 · Occiput", and so on, in number order.

## Database migration (additive only)
```sql
ALTER TABLE public.episode_locations
  ADD COLUMN selection_order integer,
  ADD COLUMN first_selected_at timestamptz;

-- Backfill: number by creation order within each episode (deselected rows included, so gaps are kept)
UPDATE public.episode_locations el SET
  selection_order = s.rn,
  first_selected_at = COALESCE(el.first_selected_at, el.created_at)
FROM (
  SELECT id, row_number() OVER (PARTITION BY episode_id ORDER BY created_at, id) AS rn
  FROM public.episode_locations
) s WHERE s.id = el.id;

-- Assign the next number automatically on insert, so two quick taps can't share a number
CREATE FUNCTION public.assign_selection_order() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(NEW.episode_id::text));
  IF NEW.selection_order IS NULL THEN
    SELECT COALESCE(MAX(selection_order), 0) + 1 INTO NEW.selection_order
    FROM public.episode_locations WHERE episode_id = NEW.episode_id;
  END IF;
  NEW.first_selected_at := COALESCE(NEW.first_selected_at, now());
  RETURN NEW;
END $$;
CREATE TRIGGER trg_assign_selection_order BEFORE INSERT ON public.episode_locations
  FOR EACH ROW EXECUTE FUNCTION public.assign_selection_order();

-- Keep the number and time fixed after creation
CREATE FUNCTION public.lock_selection_order() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.selection_order := OLD.selection_order;
  NEW.first_selected_at := OLD.first_selected_at;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_lock_selection_order BEFORE UPDATE ON public.episode_locations
  FOR EACH ROW EXECUTE FUNCTION public.lock_selection_order();

CREATE UNIQUE INDEX episode_locations_episode_order_uniq
  ON public.episode_locations (episode_id, selection_order);

COMMENT ON COLUMN public.episode_locations.is_origin IS
  'DEPRECATED as source of truth: origin = selection_order 1 and not deselected. Still written for older readers.';
```
No columns or rows are removed. `is_origin` stays. Once every row has a number it is made required in a later migration.

## Files that change
- `src/contexts/LocationContext.tsx`: add `selection_order` and `first_selected_at` to the type. Sort loaded areas by `selection_order`. In sync, stop picking an origin. Write `is_origin = (selection_order === 1 && selected)` only for compatibility. Reselection already reuses the same row, so the number is kept.
- `src/components/logheadache/LocationTabs.tsx`: chip text becomes `{order} · {name}`, plus an "Origin" badge when order is 1.
- `src/components/logheadache/LogPainLocation.tsx`: show selected areas in number order.
- `src/lib/analysis.ts`: add `selection_order` and `first_selected_at` to `AreaRow` and `AnalysisUnit`. Add `isOrigin(row)` and the three calculations below. Nothing reads `is_origin` any more.
- New `src/components/analysis/AreaOrderAnalysis.tsx`, added to `src/pages/Analysis.tsx`.
- `supabase/functions/generate-ai-report/index.ts`: copy the same three calculations inline, as the current rule requires, and add a short "Area order" section.
- `src/lib/__tests__/analysis.test.ts`: tests for each rule.
- `AGENTS.md`: replace the origin rule with "origin = selection_order 1, the number never changes".

## The three analysis views
These use completed episodes only, through `fetchAnalysisData`. They include areas that were later unselected, because their order is still part of the history. The fetch will need a variant that keeps deselected rows for these views only.

1. **First area**: for each episode, take the area with `selection_order = 1` and count episodes by area (using `location_key`, or the name for older rows). Shows counts such as "Left temple — 7 episodes". Percentages appear only when there are at least 10 episodes.
2. **By order rank**: group areas into 1st, 2nd and later (3+). For each group show:
   - the number of areas
   - the median pain intensity, using the area's value or else the episode's
   - the top 3 triggers with counts
   - outcome counts (effective / partial / not effective), with blank outcomes left out as today
   Groups with fewer than 5 areas are labelled "small sample" and show counts only.
3. **Spread timing**: for each episode with both area 1 and area 2, gap = area 2's first-selected time minus area 1's. Show the median and range in minutes, and the number of episodes. Below 5 episodes, list the individual gaps instead of a median. Note: for older rows the times come from when the row was created, so they show when the area was logged, not when the pain started.

## Tests
- Area numbers 1, 2, 3 stay the same after unselecting and reselecting 2. No new row is created and no renumbering happens.
- Origin shows only while area 1 is selected.
- Each of the three calculations gives the expected counts, median and gap, and applies the small-sample labels.
