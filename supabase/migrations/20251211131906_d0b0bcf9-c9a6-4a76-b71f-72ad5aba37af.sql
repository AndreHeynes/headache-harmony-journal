-- Add unique constraint for unified_health_data to support upsert
CREATE UNIQUE INDEX IF NOT EXISTS unified_health_data_user_date_type_source_idx 
ON public.unified_health_data (user_id, date, data_type, source);