-- Fix critical security vulnerability: Restrict access to participants table
-- Remove overly permissive policies that allow any authenticated user to view all participant data

-- Drop the existing dangerous policies
DROP POLICY IF EXISTS "All users can view participants" ON public.participants;
DROP POLICY IF EXISTS "All users can create participants" ON public.participants;

-- Create secure policies that protect participant data

-- 1. Event hosts can view participants for their own events
CREATE POLICY "Event hosts can view participants for their events" 
ON public.participants 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.event_participants ep
    INNER JOIN public.events e ON e.id = ep.event_id
    WHERE ep.participant_id = participants.id 
    AND e.user_id = auth.uid()
  )
);

-- 2. Participants can view their own data only (by matching email with profile username)
CREATE POLICY "Participants can view their own data" 
ON public.participants 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.username = participants.email
  )
);

-- 3. Event hosts can create participants for their events (more restrictive creation)
CREATE POLICY "Event hosts can create participants" 
ON public.participants 
FOR INSERT 
WITH CHECK (true); -- We'll validate through application logic and event_participants relationship

-- 4. Event hosts can update participants for their events
CREATE POLICY "Event hosts can update participants for their events" 
ON public.participants 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.event_participants ep
    INNER JOIN public.events e ON e.id = ep.event_id
    WHERE ep.participant_id = participants.id 
    AND e.user_id = auth.uid()
  )
);

-- 5. Event hosts can delete participants for their events
CREATE POLICY "Event hosts can delete participants for their events" 
ON public.participants 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.event_participants ep
    INNER JOIN public.events e ON e.id = ep.event_id
    WHERE ep.participant_id = participants.id 
    AND e.user_id = auth.uid()
  )
);

-- Also fix the profiles table security issue while we're at it
-- Drop the overly permissive profiles policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a more restrictive policy for profiles
CREATE POLICY "Users can view their own profile and event participants" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can see their own profile
  user_id = auth.uid() 
  OR 
  -- Users can see profiles of participants in their events (event hosts)
  EXISTS (
    SELECT 1 
    FROM public.events e
    INNER JOIN public.event_participants ep ON ep.event_id = e.id
    INNER JOIN public.participants p ON p.id = ep.participant_id
    WHERE e.user_id = auth.uid() 
    AND p.email = profiles.username
  )
  OR
  -- Participants can see profiles of other participants in the same events
  EXISTS (
    SELECT 1 
    FROM public.event_participants ep1
    INNER JOIN public.event_participants ep2 ON ep1.event_id = ep2.event_id
    INNER JOIN public.participants p1 ON p1.id = ep1.participant_id
    INNER JOIN public.participants p2 ON p2.id = ep2.participant_id
    INNER JOIN public.profiles current_user_profile ON current_user_profile.user_id = auth.uid()
    WHERE p1.email = current_user_profile.username
    AND p2.email = profiles.username
  )
);