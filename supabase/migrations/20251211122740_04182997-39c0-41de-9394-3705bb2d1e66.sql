-- Create unified_health_data table for external tracker data
CREATE TABLE public.unified_health_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  data_type TEXT NOT NULL CHECK (data_type IN ('sleep', 'menstrual')),
  source TEXT NOT NULL DEFAULT 'manual',
  
  -- Sleep fields
  sleep_duration_minutes INTEGER,
  sleep_quality_score INTEGER CHECK (sleep_quality_score >= 0 AND sleep_quality_score <= 100),
  sleep_stages JSONB,
  bed_time TIMESTAMP WITH TIME ZONE,
  wake_time TIMESTAMP WITH TIME ZONE,
  
  -- Menstrual fields
  cycle_day INTEGER,
  menstrual_phase TEXT CHECK (menstrual_phase IN ('menstrual', 'follicular', 'ovulation', 'luteal', NULL)),
  period_flow TEXT CHECK (period_flow IN ('none', 'spotting', 'light', 'medium', 'heavy', NULL)),
  
  -- Metadata
  raw_data JSONB,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id, date, data_type, source)
);

-- Create health_tracker_connections table for OAuth tokens
CREATE TABLE public.health_tracker_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('fitbit', 'oura', 'garmin', 'withings', 'apple_health', 'google_fit')),
  is_connected BOOLEAN DEFAULT false,
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  scopes TEXT[],
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id, provider)
);

-- Enable RLS
ALTER TABLE public.unified_health_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_tracker_connections ENABLE ROW LEVEL SECURITY;

-- RLS policies for unified_health_data
CREATE POLICY "Users can view their own health data"
ON public.unified_health_data FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health data"
ON public.unified_health_data FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health data"
ON public.unified_health_data FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health data"
ON public.unified_health_data FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for health_tracker_connections
CREATE POLICY "Users can view their own connections"
ON public.health_tracker_connections FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own connections"
ON public.health_tracker_connections FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections"
ON public.health_tracker_connections FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connections"
ON public.health_tracker_connections FOR DELETE
USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_unified_health_data_updated_at
BEFORE UPDATE ON public.unified_health_data
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_health_tracker_connections_updated_at
BEFORE UPDATE ON public.health_tracker_connections
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();