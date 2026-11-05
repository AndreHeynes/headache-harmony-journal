-- Beta premium window per user
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_tier text NOT NULL DEFAULT 'beta_premium',
  ADD COLUMN IF NOT EXISTS premium_expires_at timestamptz DEFAULT (now() + interval '56 days');

-- Existing users: start date = signup date
UPDATE public.profiles
SET premium_expires_at = COALESCE(created_at, now()) + interval '56 days'
WHERE premium_expires_at IS NULL OR premium_expires_at <> COALESCE(created_at, now()) + interval '56 days';

-- Users cannot change their own tier or expiry
CREATE OR REPLACE FUNCTION public.protect_profile_tier()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.role() = 'authenticated' THEN
    IF TG_OP = 'INSERT' THEN
      NEW.subscription_tier := 'beta_premium';
      NEW.premium_expires_at := now() + interval '56 days';
    ELSE
      NEW.subscription_tier := OLD.subscription_tier;
      NEW.premium_expires_at := OLD.premium_expires_at;
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS protect_profile_tier ON public.profiles;
CREATE TRIGGER protect_profile_tier BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_tier();

-- Wearable metrics (manual entry)
ALTER TABLE public.unified_health_data
  ADD COLUMN IF NOT EXISTS resting_heart_rate integer,
  ADD COLUMN IF NOT EXISTS hrv integer;

-- Journal now sends only the Day 0 welcome; landing page owns days 3-56
CREATE OR REPLACE FUNCTION public.schedule_beta_emails_on_signup()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.beta_email_queue (user_id, email, full_name, email_type, scheduled_for)
  VALUES (NEW.id, NEW.email, NEW.full_name, 'welcome', NOW());
  RETURN NEW;
END $$;

-- Cancel not-yet-sent local drip emails (kept as rows, marked cancelled)
UPDATE public.beta_email_queue
SET status = 'cancelled', updated_at = now()
WHERE status = 'pending' AND email_type <> 'welcome';