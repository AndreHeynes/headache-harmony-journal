-- Drop the overly permissive test_events INSERT policy
DROP POLICY IF EXISTS "Users can create test events" ON test_events;

-- Create a more restrictive policy that requires authentication and user ownership
CREATE POLICY "Users can create test events" 
ON test_events FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);