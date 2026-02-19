
-- Add priority_level and screening_responses to red_flags table
ALTER TABLE public.red_flags 
ADD COLUMN IF NOT EXISTS priority_level text DEFAULT 'low',
ADD COLUMN IF NOT EXISTS screening_responses jsonb DEFAULT '{}';

-- Add a comment for documentation
COMMENT ON COLUMN public.red_flags.priority_level IS 'high, medium, or low based on SNOOP criteria';
COMMENT ON COLUMN public.red_flags.screening_responses IS 'Full SNOOP screening answers from the logging session';
