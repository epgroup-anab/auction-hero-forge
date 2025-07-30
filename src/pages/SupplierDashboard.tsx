import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Mail, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EventInvitation {
  id: string;
  name: string;
  event_type: string;
  status: string;
  deadline?: string;
  host_name?: string;
  host_company?: string;
}

interface CurrentEvent {
  id: string;
  name: string;
  status: string;
  deadline?: string;
}

interface Message {
  id: string;
  subject?: string;
  content: string;
  sender: string;
  created_at: string;
  is_read: boolean;
}

const SupplierDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [eventInvitations, setEventInvitations] = useState<EventInvitation[]>([]);
  const [currentEvents, setCurrentEvents] = useState<CurrentEvent[]>([]);
  const [closedEvents, setClosedEvents] = useState<CurrentEvent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchSupplierData();
    }
  }, [user, loading, navigate]);

  const fetchSupplierData = async () => {
    try {
      // Get current user's profile to find participant record
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", user?.id)
        .single();

      if (!profile?.username) return;

      // Get participant record
      const { data: participant } = await supabase
        .from("participants")
        .select("id")
        .eq("email", profile.username)
        .single();

      if (!participant) return;

      // Fetch event invitations (pending)
      const { data: invitations } = await supabase
        .from("event_participants")
        .select(`
          id,
          status,
          event_id,
          events (
            id,
            name,
            status,
            questionnaires (deadline),
            profiles (display_name, username)
          )
        `)
        .eq("participant_id", participant.id)
        .eq("status", "invited");

      // Fetch current events (accepted and approved)
      const { data: current } = await supabase
        .from("event_participants")
        .select(`
          id,
          status,
          event_id,
          events (
            id,
            name,
            status
          )
        `)
        .eq("participant_id", participant.id)
        .in("status", ["accepted", "approved"]);

      // Fetch closed events
      const { data: closed } = await supabase
        .from("event_participants")
        .select(`
          id,
          status,
          event_id,
          events (
            id,
            name,
            status
          )
        `)
        .eq("participant_id", participant.id)
        .eq("status", "closed");

      // Fetch recent messages
      const { data: recentMessages } = await supabase
        .from("event_messages")
        .select(`
          id,
          subject,
          content,
          created_at,
          is_read,
          sender_id,
          events (name)
        `)
        .limit(5)
        .order("created_at", { ascending: false });

      setEventInvitations(
        invitations?.map((inv: any) => ({
          id: inv.event_id,
          name: inv.events.name,
          event_type: "Questionnaire + RFQ",
          status: inv.status,
          deadline: inv.events.questionnaires?.[0]?.deadline,
          host_name: inv.events.profiles?.display_name,
          host_company: "Market Dojo",
        })) || []
      );

      setCurrentEvents(
        current?.map((evt: any) => ({
          id: evt.event_id,
          name: evt.events.name,
          status: evt.events.status,
        })) || []
      );

      setClosedEvents(
        closed?.map((evt: any) => ({
          id: evt.event_id,
          name: evt.events.name,
          status: evt.events.status,
        })) || []
      );

      setMessages(
        recentMessages?.map((msg: any) => ({
          id: msg.id,
          subject: msg.subject,
          content: msg.content,
          sender: msg.events?.name || "Host",
          created_at: msg.created_at,
          is_read: msg.is_read,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInvitations = () => {
    navigate("/supplier/invitations");
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/supplier/events/${eventId}`);
  };

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
          <p className="text-muted-foreground">
            Logged in as {user?.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Invitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Event Invitations
              </CardTitle>
              <CardDescription>
                Pending invitations that require your action
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eventInvitations.length > 0 ? (
                <div className="space-y-4">
                  {eventInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="border-l-4 border-orange-500 pl-4 py-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{invitation.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {invitation.event_type}
                          </p>
                          {invitation.deadline && (
                            <p className="text-sm text-orange-600 flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Deadline: {new Date(invitation.deadline).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Action Required
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleViewInvitations} className="w-full">
                    Show all or enter invite code
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No pending invitations</p>
              )}
            </CardContent>
          </Card>

          {/* Current Events */}
          <Card>
            <CardHeader>
              <CardTitle>Current Events</CardTitle>
              <CardDescription>
                Events you are currently participating in
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentEvents.length > 0 ? (
                <div className="space-y-4">
                  {currentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewEvent(event.id)}
                    >
                      <div>
                        <h4 className="font-semibold">{event.name}</h4>
                        <Badge variant="secondary">{event.status}</Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Event
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Any events that you accept the invite for will be listed here until either: 
                  the event either closes or you are declined by the Host or you decline to take part, 
                  after which the event will be in Closed events.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Closed Events */}
          <Card>
            <CardHeader>
              <CardTitle>Closed Events</CardTitle>
              <CardDescription>
                Historical record of completed events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {closedEvents.length > 0 ? (
                <div className="space-y-2">
                  {closedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="font-medium">{event.name}</span>
                      <Badge variant="outline">Closed</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No closed events</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Release Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Release Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">New Release - December 2024</h4>
                  <Button variant="outline" size="sm">Mark Read</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Latest platform updates and new features
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-semibold">New Release - November 2024</h4>
                <p className="text-sm text-muted-foreground">
                  Bug fixes and performance improvements
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {messages.length > 0 ? (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">From: {message.sender}</span>
                        {!message.is_read && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {message.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No recent messages</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;