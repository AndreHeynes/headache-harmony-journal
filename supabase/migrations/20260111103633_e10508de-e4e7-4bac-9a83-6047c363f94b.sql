-- Drop the old policy completely
DROP POLICY IF EXISTS "Users can create test events" ON test_events;

-- Create the new secure policy (only authenticated users can insert their own events)
CREATE POLICY "Users can create their own test events" 
ON test_events FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);