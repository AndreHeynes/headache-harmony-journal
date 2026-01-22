-- ============================================
-- 1. Create dedicated rate_limits table for edge function rate limiting
-- ============================================

CREATE TABLE public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique constraint to upsert on same identifier/endpoint/window
CREATE UNIQUE INDEX idx_rate_limits_unique ON rate_limits(identifier, endpoint, window_start);

-- Index for cleanup queries
CREATE INDEX idx_rate_limits_window_end ON rate_limits(window_end);

-- Enable RLS with NO policies = service role only access
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE/DELETE policies means ONLY service role can access this table
-- This is intentional for security - rate limit data should not be user-accessible

-- ============================================
-- 2. Create oauth_state_tokens table for CSRF protection
-- ============================================

CREATE TABLE public.oauth_state_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  provider TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup and cleanup
CREATE INDEX idx_oauth_state_expires ON oauth_state_tokens(expires_at);
CREATE INDEX idx_oauth_state_lookup ON oauth_state_tokens(token, user_id);

-- Enable RLS with NO policies = service role only access
ALTER TABLE oauth_state_tokens ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. Add explicit DENY policies for beta_email_queue INSERT/UPDATE/DELETE
-- Since there are no policies for these operations, RLS blocks them by default
-- However, adding explicit deny policies makes intent clear and prevents future mistakes
-- ============================================

-- Actually, RLS is already enabled and there are no INSERT/UPDATE/DELETE policies
-- which means only service role can modify. Let's confirm with a comment trigger
COMMENT ON TABLE public.beta_email_queue IS 'Beta email queue - only modifiable by service role. No user INSERT/UPDATE/DELETE policies exist by design.';