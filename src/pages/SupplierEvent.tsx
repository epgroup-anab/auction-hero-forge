import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, User, Building, Mail, Phone, CheckCircle, XCircle } from "lucide-react";

interface EventData {
  id: string;
  name: string;
  description?: string;
  brief_text?: string;
  status: string;
  include_rfq: boolean;
  include_questionnaire: boolean;
  include_auction: boolean;
  default_currency: string;
  host: {
    display_name: string;
    username: string;
  };
  questionnaires: Array<{
    id: string;
    name: string;
    deadline?: string;
  }>;
}

interface ParticipantStatus {
  status: string;
  approved: boolean;
}

const SupplierEvent = () => {
  const { eventId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [participantStatus, setParticipantStatus] = useState<ParticipantStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (user && eventId) {
      fetchEventData();
    }
  }, [user, loading, eventId, navigate]);

  const fetchEventData = async () => {
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

      // Fetch event data with host info
      const { data: event } = await supabase
        .from("events")
        .select(`
          *,
          questionnaires (id, name, deadline)
        `)
        .eq("id", eventId)
        .single();

      // Fetch host profile separately
      const { data: hostProfile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("user_id", event?.user_id)
        .single();

      if (!event) {
        toast({
          title: "Error",
          description: "Event not found",
          variant: "destructive",
        });
        navigate("/supplier/dashboard");
        return;
      }

      // Get participant status for this event
      const { data: eventParticipant } = await supabase
        .from("event_participants")
        .select("status, approved")
        .eq("event_id", eventId)
        .eq("participant_id", participant.id)
        .single();

      setEventData({
        id: event.id,
        name: event.name,
        description: event.description,
        brief_text: event.brief_text,
        status: event.status,
        include_rfq: event.include_rfq,
        include_questionnaire: event.include_questionnaire,
        include_auction: event.include_auction,
        default_currency: event.default_currency,
        host: {
          display_name: hostProfile?.display_name || "Unknown Host",
          username: hostProfile?.username || "",
        },
        questionnaires: event.questionnaires || [],
      });

      setParticipantStatus(eventParticipant);
    } catch (error) {
      console.error("Error fetching event data:", error);
      toast({
        title: "Error",
        description: "Failed to load event data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDeadlineStatus = () => {
    if (!eventData?.questionnaires?.[0]?.deadline) return null;
    
    const deadline = new Date(eventData.questionnaires[0].deadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysLeft > 0 ? `${daysLeft} days` : "Expired";
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "terms":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Event not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/supplier/dashboard")}
        >
          ← Back to Dashboard
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{eventData.name}</h1>
            <Badge variant="outline">Current</Badge>
          </div>
          <div className="flex items-center gap-4 mt-2">
            {eventData.questionnaires?.[0]?.deadline && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Terms & conditions Deadline: {getDeadlineStatus()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Message */}
      {participantStatus?.status === "accepted" && participantStatus?.approved && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="pt-6">
            <p className="text-green-700 dark:text-green-300">
              You have accepted the event and the host has approved you to take part. 
              Please review the Overview below to understand more about this event.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="terms" className="flex items-center gap-2">
            {getTabIcon("terms")}
            Terms & conditions
          </TabsTrigger>
          <TabsTrigger value="rfqs" disabled={!eventData.include_rfq}>
            RFQs
          </TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Overview</CardTitle>
              <CardDescription>
                Please work through the tabs from left to right. The last two tabs can be used for any documentation and for messaging. 
                The Host contact details are provided below in case you have any questions on this event.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Event Brief */}
              <div>
                <h3 className="font-semibold mb-2">Event Brief</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  {eventData.brief_text ? (
                    <p className="text-sm">{eventData.brief_text}</p>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <p>We are looking to source 20 laptops.</p>
                      <p>These must be delivered to our London office.</p>
                      <p>Please see product specification available in the Documents tab for more details.</p>
                      <p>If you have any questions, please use the Messages tab to contact us.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Configuration */}
              <div>
                <h3 className="font-semibold mb-3">Event Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Event Name:</span>
                      <span className="text-sm">{eventData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Event Type:</span>
                      <span className="text-sm">Request for Quotation</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Default Currency:</span>
                      <span className="text-sm">{eventData.default_currency}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Multi Currency event:</span>
                      <span className="text-sm">No</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Tied bids:</span>
                      <span className="text-sm">Equal worst position</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions Info */}
              {eventData.include_questionnaire && (
                <div>
                  <h3 className="font-semibold mb-3">Terms & Conditions Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Question Quantity:</span>
                      <span className="text-sm">{eventData.questionnaires.length}</span>
                    </div>
                    {eventData.questionnaires?.[0]?.deadline && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Deadline:</span>
                        <span className="text-sm">
                          {new Date(eventData.questionnaires[0].deadline).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Host Contact Details */}
              <div>
                <h3 className="font-semibold mb-3">Host Contact Details</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">{eventData.host.display_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span className="text-sm font-medium">Company:</span>
                    <span className="text-sm">Market Dojo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">E-mail:</span>
                    <span className="text-sm">{eventData.host.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">012345678910</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Terms & Conditions Tab */}
        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Terms & Conditions
              </CardTitle>
              <CardDescription>
                Please review and accept the terms and conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Terms & Conditions functionality coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RFQs Tab */}
        <TabsContent value="rfqs">
          <Card>
            <CardHeader>
              <CardTitle>RFQs</CardTitle>
              <CardDescription>
                Request for Quotation lots and bidding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">RFQ functionality coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Event documentation and file sharing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Document management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Communication with the event host
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Messaging functionality coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierEvent;