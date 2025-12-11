-- Add unique constraint for upsert functionality on unified_health_data
CREATE UNIQUE INDEX IF NOT EXISTS unified_health_data_user_date_type_idx 
ON public.unified_health_data (user_id, date, data_type);