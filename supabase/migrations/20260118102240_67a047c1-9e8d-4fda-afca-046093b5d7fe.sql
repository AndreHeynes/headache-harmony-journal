-- Create beta_email_queue table for tracking scheduled emails
CREATE TABLE public.beta_email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  email_type TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for efficient queue processing
CREATE INDEX idx_beta_email_queue_pending 
ON beta_email_queue(scheduled_for) 
WHERE status = 'pending';

-- Create index for user lookups
CREATE INDEX idx_beta_email_queue_user_id ON beta_email_queue(user_id);

-- Enable RLS
ALTER TABLE public.beta_email_queue ENABLE ROW LEVEL SECURITY;

-- Users can view their own email queue entries
CREATE POLICY "Users can view their own email queue"
ON public.beta_email_queue
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can manage all entries (for edge functions)
-- Note: Service role bypasses RLS by default

-- Add updated_at trigger
CREATE TRIGGER update_beta_email_queue_updated_at
BEFORE UPDATE ON public.beta_email_queue
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create function to schedule beta emails when profile is created
CREATE OR REPLACE FUNCTION public.schedule_beta_emails_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert all 8 scheduled emails for the new user
  INSERT INTO public.beta_email_queue (user_id, email, full_name, email_type, scheduled_for)
  VALUES 
    (NEW.id, NEW.email, NEW.full_name, 'welcome', NOW()),
    (NEW.id, NEW.email, NEW.full_name, 'getting_started', NOW() + INTERVAL '3 days'),
    (NEW.id, NEW.email, NEW.full_name, 'feature_discovery', NOW() + INTERVAL '7 days'),
    (NEW.id, NEW.email, NEW.full_name, 'engagement_nudge', NOW() + INTERVAL '14 days'),
    (NEW.id, NEW.email, NEW.full_name, 'mid_point_feedback', NOW() + INTERVAL '28 days'),
    (NEW.id, NEW.email, NEW.full_name, 'power_user_tips', NOW() + INTERVAL '42 days'),
    (NEW.id, NEW.email, NEW.full_name, 'beta_ending_soon', NOW() + INTERVAL '52 days'),
    (NEW.id, NEW.email, NEW.full_name, 'final_feedback', NOW() + INTERVAL '56 days');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-schedule emails on new profile creation
CREATE TRIGGER trigger_schedule_beta_emails
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.schedule_beta_emails_on_signup();