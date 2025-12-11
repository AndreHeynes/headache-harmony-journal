-- Add unique constraint for health_tracker_connections
CREATE UNIQUE INDEX IF NOT EXISTS health_tracker_connections_user_provider_idx 
ON public.health_tracker_connections (user_id, provider);