-- Create table for bid submissions
CREATE TABLE public.bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  participant_id UUID NOT NULL,
  lot_id UUID NOT NULL,
  price_per_unit NUMERIC NOT NULL,
  total_value NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, participant_id, lot_id)
);

-- Enable RLS on bids
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Create policies for bids
CREATE POLICY "Event hosts can view bids for their events"
ON public.bids
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM events 
  WHERE events.id = bids.event_id 
  AND events.user_id = auth.uid()
));

CREATE POLICY "Participants can view their own bids"
ON public.bids
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM participants p
  JOIN profiles pr ON pr.user_id = auth.uid()
  WHERE p.id = bids.participant_id
  AND p.email = pr.username
));

CREATE POLICY "Participants can create their own bids"
ON public.bids
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM participants p
  JOIN profiles pr ON pr.user_id = auth.uid()
  WHERE p.id = bids.participant_id
  AND p.email = pr.username
));

CREATE POLICY "Participants can update their own bids"
ON public.bids
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM participants p
  JOIN profiles pr ON pr.user_id = auth.uid()
  WHERE p.id = bids.participant_id
  AND p.email = pr.username
));

-- Create table for messages between hosts and suppliers
CREATE TABLE public.event_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  recipient_id UUID,
  subject TEXT,
  content TEXT NOT NULL,
  is_from_host BOOLEAN NOT NULL DEFAULT false,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on event_messages
ALTER TABLE public.event_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for event_messages
CREATE POLICY "Event hosts can manage messages for their events"
ON public.event_messages
FOR ALL
USING (EXISTS (
  SELECT 1 FROM events 
  WHERE events.id = event_messages.event_id 
  AND events.user_id = auth.uid()
));

CREATE POLICY "Participants can view messages for their events"
ON public.event_messages
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM event_participants ep
  JOIN participants p ON p.id = ep.participant_id
  JOIN profiles pr ON pr.user_id = auth.uid()
  WHERE ep.event_id = event_messages.event_id
  AND p.email = pr.username
));

CREATE POLICY "Participants can create messages for their events"
ON public.event_messages
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM event_participants ep
  JOIN participants p ON p.id = ep.participant_id
  JOIN profiles pr ON pr.user_id = auth.uid()
  WHERE ep.event_id = event_messages.event_id
  AND p.email = pr.username
));

-- Create table for terms & conditions responses
CREATE TABLE public.terms_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  participant_id UUID NOT NULL,
  questionnaire_id UUID NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, participant_id, questionnaire_id)
);

-- Enable RLS on terms_responses
ALTER TABLE public.terms_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for terms_responses
CREATE POLICY "Event hosts can view responses for their events"
ON public.terms_responses
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM events 
  WHERE events.id = terms_responses.event_id 
  AND events.user_id = auth.uid()
));

CREATE POLICY "Participants can manage their own responses"
ON public.terms_responses
FOR ALL
USING (EXISTS (
  SELECT 1 FROM participants p
  JOIN profiles pr ON pr.user_id = auth.uid()
  WHERE p.id = terms_responses.participant_id
  AND p.email = pr.username
));

-- Create trigger for updated_at on bids
CREATE TRIGGER update_bids_updated_at
BEFORE UPDATE ON public.bids
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on terms_responses
CREATE TRIGGER update_terms_responses_updated_at
BEFORE UPDATE ON public.terms_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();