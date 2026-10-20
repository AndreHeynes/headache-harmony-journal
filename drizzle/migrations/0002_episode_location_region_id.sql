ALTER TABLE public.episode_locations ADD COLUMN region_id text;
COMMENT ON COLUMN public.episode_locations.region_id IS 'Region ID on the new SVG skull map; null for legacy-only areas (e.g. pressure band). location_key is kept unchanged.';
UPDATE public.episode_locations SET region_id = CASE location_key
  WHEN 'forehead_center' THEN 'mid-forehead' WHEN 'forehead_left' THEN 'l-brow' WHEN 'forehead_right' THEN 'r-brow'
  WHEN 'eye_left' THEN 'l-eye' WHEN 'eye_right' THEN 'r-eye' WHEN 'temple_left' THEN 'l-temple' WHEN 'temple_right' THEN 'r-temple'
  WHEN 'half_face_left' THEN 'l-face' WHEN 'half_face_right' THEN 'r-face'
  WHEN 'upper_sinus_left' THEN 'l-sinus' WHEN 'upper_sinus_right' THEN 'r-sinus' WHEN 'lower_sinus_left' THEN 'l-sinus' WHEN 'lower_sinus_right' THEN 'r-sinus'
  WHEN 'parietal_left' THEN 'l-side' WHEN 'parietal_right' THEN 'r-side' WHEN 'jaw_left' THEN 'l-tmj' WHEN 'jaw_right' THEN 'r-tmj'
  WHEN 'occipital_center' THEN 'occiput' WHEN 'occipital_left' THEN 'l-occiput' WHEN 'occipital_right' THEN 'r-occiput'
  WHEN 'crown' THEN 'crown' WHEN 'skull_base' THEN 'neck'
  ELSE CASE WHEN location_key IS NULL AND location_name IN ('Occiput','Occipital Area') THEN 'occiput' END END;