-- Add is_origin flag to episode_locations for origin vs spread tracking
ALTER TABLE public.episode_locations ADD COLUMN is_origin boolean NOT NULL DEFAULT true;

-- Add treatment_timing, relief_timing, and treatment_outcome to headache_episodes treatment isn't changing schema
-- These are stored in the treatment JSONB, but we also want structured fields on episode_locations
ALTER TABLE public.episode_locations 
  ADD COLUMN treatment_timing text,
  ADD COLUMN relief_timing text,
  ADD COLUMN treatment_outcome text;

-- Also add to headache_episodes for single-location backward compatibility  
ALTER TABLE public.headache_episodes
  ADD COLUMN treatment_timing text,
  ADD COLUMN relief_timing text,
  ADD COLUMN treatment_outcome text;