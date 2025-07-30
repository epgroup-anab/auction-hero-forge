import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, Users, MessageSquare, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Event {
  id: string;
  name: string;
  status: string;
  include_auction: boolean;
  include_questionnaire: boolean;
  include_rfq: boolean;
}

interface Participant {
  id: string;
  email: string;
  name?: string;
  company?: string;
}

interface EventParticipant {
  id: string;
  participant_id: string;
  event_id: string;
  status: string;
  approved: boolean;
}

interface SupplierMessagingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SupplierMessagingDialog = ({ open, onOpenChange }: SupplierMessagingDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [eventParticipants, setEventParticipants] = useState<EventParticipant[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [sendToAll, setSendToAll] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchEvents();
    }
  }, [open, user]);

  useEffect(() => {
    if (selectedEventId) {
      fetchEventParticipants();
    }
  }, [selectedEventId]);

  const fetchEvents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events.",
        variant: "destructive"
      });
    }
  };

  const fetchEventParticipants = async () => {
    if (!selectedEventId) return;

    try {
      setIsLoading(true);
      
      // Fetch event participants
      const { data: eventParticipants, error: epError } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', selectedEventId);

      if (epError) throw epError;

      setEventParticipants(eventParticipants || []);

      // Fetch participant details
      if (eventParticipants && eventParticipants.length > 0) {
        const participantIds = eventParticipants.map(ep => ep.participant_id);
        const { data: participants, error: pError } = await supabase
          .from('participants')
          .select('*')
          .in('id', participantIds);

        if (pError) throw pError;
        setParticipants(participants || []);
      } else {
        setParticipants([]);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch event participants.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleParticipantToggle = (participantId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(participantId) 
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleSendMessage = () => {
    if (!messageSubject.trim() || !messageContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message content.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedEventId) {
      toast({
        title: "No Event Selected",
        description: "Please select an event first.",
        variant: "destructive"
      });
      return;
    }

    if (!sendToAll && selectedParticipants.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please select participants or choose 'Send to All'.",
        variant: "destructive"
      });
      return;
    }

    const selectedEvent = events.find(e => e.id === selectedEventId);
    const recipientCount = sendToAll ? participants.length : selectedParticipants.length;
    const recipientText = sendToAll ? "all participants" : `${recipientCount} selected participant(s)`;

    toast({
      title: "Message Sent",
      description: `Message "${messageSubject}" sent to ${recipientText} in ${selectedEvent?.name}.`,
    });

    // Reset form
    setMessageSubject("");
    setMessageContent("");
    setSelectedParticipants([]);
    setSendToAll(true);
    setSelectedEventId("");
    onOpenChange(false);
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message Suppliers
          </DialogTitle>
          <DialogDescription>
            Send messages to suppliers participating in your events
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Selection */}
          <div className="space-y-2">
            <Label>Select Event</Label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an event..." />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    <div className="flex items-center gap-2">
                      {event.name}
                      <Badge variant="outline" className="text-xs">
                        {event.include_auction && event.include_rfq ? 'Auction + RFQ' : 
                         event.include_auction ? 'Auction' : 
                         event.include_rfq ? 'RFQ' : 'Event'}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Participant Selection */}
          {selectedEventId && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Recipients</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sendToAll" 
                    checked={sendToAll} 
                    onCheckedChange={(checked) => setSendToAll(checked === true)}
                  />
                  <Label htmlFor="sendToAll" className="text-sm">
                    Send to all participants ({participants.length})
                  </Label>
                </div>
              </div>

              {!sendToAll && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Select Participants
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-40 overflow-y-auto">
                    {isLoading ? (
                      <div className="text-center text-muted-foreground">Loading participants...</div>
                    ) : participants.length === 0 ? (
                      <div className="text-center text-muted-foreground">
                        No participants found for this event
                      </div>
                    ) : (
                      participants.map((participant) => (
                        <div key={participant.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
                          <Checkbox 
                            id={participant.id}
                            checked={selectedParticipants.includes(participant.id)}
                            onCheckedChange={() => handleParticipantToggle(participant.id)}
                          />
                          <Label htmlFor={participant.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <div>
                                <p className="font-medium text-sm">{participant.name || participant.email}</p>
                                {participant.company && (
                                  <p className="text-xs text-muted-foreground">{participant.company}</p>
                                )}
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Message Content */}
          {selectedEventId && (
            <>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <input
                  id="subject"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Message subject..."
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={6}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={!selectedEventId || !messageSubject.trim() || !messageContent.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};