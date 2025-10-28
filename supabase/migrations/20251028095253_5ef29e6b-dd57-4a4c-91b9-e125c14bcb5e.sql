-- Add missing RLS policies for security

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
ON profiles FOR DELETE
USING (auth.uid() = id);

-- Restrict anonymous test events to admins only
DROP POLICY IF EXISTS "Users can view their own test events" ON test_events;
CREATE POLICY "Users can view their own test events"
ON test_events FOR SELECT
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND has_role(auth.uid(), 'admin'::app_role))
);

-- Allow users to update their own test events
CREATE POLICY "Users can update their own test events"
ON test_events FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their own test events
CREATE POLICY "Users can delete their own test events"
ON test_events FOR DELETE
USING (auth.uid() = user_id);