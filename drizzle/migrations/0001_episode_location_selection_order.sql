ALTER TABLE public.episode_locations
  ADD COLUMN selection_order integer,
  ADD COLUMN first_selected_at timestamptz;

UPDATE public.episode_locations el SET
  selection_order = s.rn,
  first_selected_at = COALESCE(el.first_selected_at, el.created_at)
FROM (
  SELECT id, row_number() OVER (PARTITION BY episode_id ORDER BY created_at, id) AS rn
  FROM public.episode_locations
) s WHERE s.id = el.id;

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