DROP POLICY IF EXISTS "Anyone can record campaign steps" ON public.campaign_events;
CREATE POLICY "Anyone can record valid campaign steps" ON public.campaign_events
FOR INSERT TO anon, authenticated
WITH CHECK (
  event_type IN ('visit','map_painted','sample_downloaded','signup')
  AND utm_source ~ '^[a-z0-9_.-]{1,60}$'
  AND (utm_medium IS NULL OR utm_medium ~ '^[a-z0-9_.-]{1,60}$')
  AND (utm_campaign IS NULL OR utm_campaign ~ '^[a-z0-9_.-]{1,60}$')
  AND (page IS NULL OR (length(page) <= 100 AND page LIKE '/%'))
  AND session_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
);