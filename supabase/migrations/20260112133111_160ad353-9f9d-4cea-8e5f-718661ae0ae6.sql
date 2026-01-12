-- Remove the vulnerable policy that allows viewing NULL user_id events
DROP POLICY IF EXISTS "Users can view their own test events" ON public.test_events;

-- Create a stricter policy - users can ONLY view their own events (no anonymous events)
CREATE POLICY "Users can view their own test events" 
ON public.test_events 
FOR SELECT 
USING (auth.uid() = user_id);

-- Note: Admins already have a separate policy to view all events via has_role check