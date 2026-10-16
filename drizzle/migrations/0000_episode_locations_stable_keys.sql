ALTER TABLE public.episode_locations
  ADD COLUMN IF NOT EXISTS location_key text,
  ADD COLUMN IF NOT EXISTS deselected_at timestamptz;

COMMENT ON COLUMN public.episode_locations.location_key IS 'Stable skull area ID (patient side), e.g. temple_left. Null for legacy rows whose name was ambiguous.';
COMMENT ON COLUMN public.episode_locations.deselected_at IS 'Set when the user unselects this area; row and its data are kept so reselecting restores them. Analyses ignore rows where this is not null.';

CREATE INDEX IF NOT EXISTS episode_locations_episode_key_idx ON public.episode_locations (episode_id, location_key);

UPDATE public.episode_locations SET location_key = CASE location_name
  WHEN 'Pressure Band' THEN 'pressure_band'
  WHEN 'Middle of the Forehead' THEN 'forehead_center'
  WHEN 'Right Forehead' THEN 'forehead_right'
  WHEN 'Left Forehead' THEN 'forehead_left'
  WHEN 'Right Eye' THEN 'eye_right'
  WHEN 'Left Eye' THEN 'eye_left'
  WHEN 'Right Temple' THEN 'temple_right'
  WHEN 'Left Temple' THEN 'temple_left'
  WHEN 'Right Half of Face' THEN 'half_face_right'
  WHEN 'Left Half of Face' THEN 'half_face_left'
  WHEN 'Right Upper Sinus' THEN 'upper_sinus_right'
  WHEN 'Left Upper Sinus' THEN 'upper_sinus_left'
  WHEN 'Right Lower Sinus' THEN 'lower_sinus_right'
  WHEN 'Left Lower Sinus' THEN 'lower_sinus_left'
  WHEN 'Occipital Area' THEN 'occipital_center'
  WHEN 'Crown of Head' THEN 'crown'
  WHEN 'Base of Head' THEN 'skull_base'
  WHEN 'Left Occipital Area' THEN 'occipital_left'
  WHEN 'Right Occipital Area' THEN 'occipital_right'
  ELSE NULL END
WHERE location_key IS NULL;