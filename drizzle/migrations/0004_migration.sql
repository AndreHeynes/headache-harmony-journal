CREATE TABLE public.campaign_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('visit','map_painted','sample_downloaded','signup')),
  utm_source text NOT NULL CHECK (char_length(utm_source) BETWEEN 1 AND 60),
  utm_medium text CHECK (char_length(utm_medium) <= 60),
  utm_campaign text CHECK (char_length(utm_campaign) <= 60),
  page text CHECK (char_length(page) <= 100),
  session_id text NOT NULL CHECK (char_length(session_id) BETWEEN 8 AND 64),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, event_type)
);
GRANT INSERT ON public.campaign_events TO anon, authenticated;
GRANT SELECT ON public.campaign_events TO authenticated;
GRANT ALL ON public.campaign_events TO service_role;
ALTER TABLE public.campaign_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record campaign steps" ON public.campaign_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view campaign steps" ON public.campaign_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX campaign_events_created_idx ON public.campaign_events (created_at);