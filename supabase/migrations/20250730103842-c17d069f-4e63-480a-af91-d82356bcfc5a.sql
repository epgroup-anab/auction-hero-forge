-- Create additional tables for the comprehensive auction creation flow

-- Auction settings table
CREATE TABLE public.auction_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE,
  start_time TIME,
  bid_direction TEXT NOT NULL DEFAULT 'reverse',
  event_type TEXT NOT NULL DEFAULT 'ranked',
  minimum_duration INTEGER NOT NULL DEFAULT 10,
  dynamic_close_period TEXT NOT NULL DEFAULT 'none',
  minimum_bid_change DECIMAL(5,2) NOT NULL DEFAULT 0.50,
  maximum_bid_change DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  tied_bid_option TEXT NOT NULL DEFAULT 'equal_worst_position',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Questionnaires table
CREATE TABLE public.questionnaires (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE,
  pre_qualification BOOLEAN NOT NULL DEFAULT false,
  scoring BOOLEAN NOT NULL DEFAULT false,
  weighting BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  mime_type TEXT,
  version TEXT NOT NULL DEFAULT '1.0',
  shared_with_all BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lots table
CREATE TABLE public.lots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_of_measure TEXT,
  current_price DECIMAL(12,2),
  qualification_price DECIMAL(12,2),
  current_value DECIMAL(12,2),
  qualification_value DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Participants table
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event participants junction table
CREATE TABLE public.event_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'invited',
  approved BOOLEAN NOT NULL DEFAULT false,
  auto_accept BOOLEAN NOT NULL DEFAULT false,
  questionnaires_completed INTEGER NOT NULL DEFAULT 0,
  lots_entered INTEGER NOT NULL DEFAULT 0,
  UNIQUE(event_id, participant_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.auction_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for auction_settings
CREATE POLICY "Users can view auction settings for their events" 
ON public.auction_settings 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = auction_settings.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can create auction settings for their events" 
ON public.auction_settings 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.events WHERE events.id = auction_settings.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can update auction settings for their events" 
ON public.auction_settings 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = auction_settings.event_id AND events.user_id = auth.uid()));

-- Create RLS policies for questionnaires
CREATE POLICY "Users can view questionnaires for their events" 
ON public.questionnaires 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = questionnaires.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can create questionnaires for their events" 
ON public.questionnaires 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.events WHERE events.id = questionnaires.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can update questionnaires for their events" 
ON public.questionnaires 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = questionnaires.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can delete questionnaires for their events" 
ON public.questionnaires 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = questionnaires.event_id AND events.user_id = auth.uid()));

-- Create RLS policies for documents
CREATE POLICY "Users can view documents for their events" 
ON public.documents 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = documents.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can create documents for their events" 
ON public.documents 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.events WHERE events.id = documents.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can update documents for their events" 
ON public.documents 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = documents.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can delete documents for their events" 
ON public.documents 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = documents.event_id AND events.user_id = auth.uid()));

-- Create RLS policies for lots
CREATE POLICY "Users can view lots for their events" 
ON public.lots 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = lots.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can create lots for their events" 
ON public.lots 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.events WHERE events.id = lots.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can update lots for their events" 
ON public.lots 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = lots.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can delete lots for their events" 
ON public.lots 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = lots.event_id AND events.user_id = auth.uid()));

-- Create RLS policies for participants (global view for all users)
CREATE POLICY "All users can view participants" 
ON public.participants 
FOR SELECT 
USING (true);

CREATE POLICY "All users can create participants" 
ON public.participants 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for event_participants
CREATE POLICY "Users can view event participants for their events" 
ON public.event_participants 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = event_participants.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can create event participants for their events" 
ON public.event_participants 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.events WHERE events.id = event_participants.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can update event participants for their events" 
ON public.event_participants 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = event_participants.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can delete event participants for their events" 
ON public.event_participants 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = event_participants.event_id AND events.user_id = auth.uid()));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_auction_settings_updated_at
BEFORE UPDATE ON public.auction_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_questionnaires_updated_at
BEFORE UPDATE ON public.questionnaires
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lots_updated_at
BEFORE UPDATE ON public.lots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_participants_updated_at
BEFORE UPDATE ON public.participants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update events table to support additional fields
ALTER TABLE public.events 
ADD COLUMN multi_currency BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN brief_text TEXT,
ADD COLUMN default_currency TEXT NOT NULL DEFAULT 'GBP';