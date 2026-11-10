CREATE OR REPLACE FUNCTION public.assign_owner_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'andreheynes@hotmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.assign_owner_admin() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS on_auth_user_owner_admin ON auth.users;
CREATE TRIGGER on_auth_user_owner_admin AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.assign_owner_admin();