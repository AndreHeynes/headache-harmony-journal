
-- Create episode_locations table for per-location pain data
CREATE TABLE public.episode_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_id UUID NOT NULL REFERENCES public.headache_episodes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  location_name TEXT NOT NULL,
  pain_intensity INTEGER,
  symptoms TEXT[],
  triggers TEXT[],
  variables JSONB,
  treatment JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.episode_locations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own locations"
ON public.episode_locations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own locations"
ON public.episode_locations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own locations"
ON public.episode_locations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own locations"
ON public.episode_locations FOR DELETE
USING (auth.uid() = user_id);

-- Index for fast lookups by episode
CREATE INDEX idx_episode_locations_episode_id ON public.episode_locations(episode_id);
CREATE INDEX idx_episode_locations_user_id ON public.episode_locations(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_episode_locations_updated_at
BEFORE UPDATE ON public.episode_locations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
