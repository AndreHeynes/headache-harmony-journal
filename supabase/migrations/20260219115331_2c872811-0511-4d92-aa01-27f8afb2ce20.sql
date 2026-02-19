
-- Add date_of_birth to profiles
ALTER TABLE public.profiles ADD COLUMN date_of_birth date;

-- Create red_flags table for SNOOP detection
CREATE TABLE public.red_flags (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  episode_id uuid REFERENCES public.headache_episodes(id),
  flag_type text NOT NULL,
  flag_details jsonb,
  acknowledged boolean NOT NULL DEFAULT false,
  acknowledged_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.red_flags ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own red flags"
  ON public.red_flags FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own red flags"
  ON public.red_flags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own red flags"
  ON public.red_flags FOR UPDATE
  USING (auth.uid() = user_id);
