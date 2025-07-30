import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Calendar } from "lucide-react";

interface EventInvitation {
  id: string;
  participant_id: string;
  event_id: string;
  name: string;
  event_type: string;
  host_name: string;
  host_company: string;
  deadline?: string;
  status: string;
}

const SupplierInvitations = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<EventInvitation[]>([]);
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchInvitations();
    }
  }, [user, loading, navigate]);

  const fetchInvitations = async () => {
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

      // Fetch event invitations
      const { data: eventParticipants } = await supabase
        .from("event_participants")
        .select(`
          id,
          participant_id,
          event_id,
          status,
          events (
            id,
            name,
            include_rfq,
            include_questionnaire,
            questionnaires (deadline),
            profiles (display_name, username)
          )
        `)
        .eq("participant_id", participant.id)
        .eq("status", "invited");

      const formattedInvitations = eventParticipants?.map((inv: any) => ({
        id: inv.id,
        participant_id: inv.participant_id,
        event_id: inv.event_id,
        name: inv.events.name,
        event_type: getEventType(inv.events),
        host_name: inv.events.profiles?.display_name || "Unknown Host",
        host_company: "Market Dojo",
        deadline: inv.events.questionnaires?.[0]?.deadline,
        status: inv.status,
      })) || [];

      setInvitations(formattedInvitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast({
        title: "Error",
        description: "Failed to load invitations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEventType = (event: any) => {
    const types = [];
    if (event.include_questionnaire) types.push("Questionnaire");
    if (event.include_rfq) types.push("RFQ");
    return types.join(" + ") || "Event";
  };

  const handleAcceptInvite = async (invitationId: string, eventId: string) => {
    setSubmitting(invitationId);
    try {
      const { error } = await supabase
        .from("event_participants")
        .update({ status: "accepted" })
        .eq("id", invitationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event invitation accepted",
      });

      // Navigate to event overview
      navigate(`/supplier/events/${eventId}`);
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast({
        title: "Error",
        description: "Failed to accept invitation",
        variant: "destructive",
      });
    } finally {
      setSubmitting(null);
    }
  };

  const handleDeclineInvite = async (invitationId: string) => {
    setSubmitting(invitationId);
    try {
      const { error } = await supabase
        .from("event_participants")
        .update({ status: "declined" })
        .eq("id", invitationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event invitation declined",
      });

      // Remove from local state
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast({
        title: "Error",
        description: "Failed to decline invitation",
        variant: "destructive",
      });
    } finally {
      setSubmitting(null);
    }
  };

  const handleSubmitInviteCode = async () => {
    if (!inviteCode.trim()) return;

    try {
      // For now, show a message that this feature is not implemented
      toast({
        title: "Feature Coming Soon",
        description: "Invite code functionality will be available soon",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid invite code",
        variant: "destructive",
      });
    }
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
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/supplier/dashboard")}
        >
          ← Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Event Invitations</h1>
          <p className="text-muted-foreground">
            Review and respond to event invitations
          </p>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Any invites you have will be listed below. Please review the invite to decide whether you would like to take part in the Event. 
            Please note that in ordinary circumstances you will not have a second chance to view the invitation if you decline it.
          </p>
        </CardContent>
      </Card>

      {/* Invitations Table */}
      {invitations.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">Event Name</Label>
                      <p className="text-sm">{invitation.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Event Owner</Label>
                      <p className="text-sm">
                        Host: {invitation.host_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Company: {invitation.host_company}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Event Type</Label>
                      <Badge variant="outline">{invitation.event_type}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Next Key Deadline</Label>
                      {invitation.deadline ? (
                        <p className="text-sm flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Terms & conditions Deadline:
                          <br />
                          {new Date(invitation.deadline).toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">No deadline set</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleAcceptInvite(invitation.id, invitation.event_id)}
                      disabled={submitting === invitation.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {submitting === invitation.id ? "Processing..." : "Accept"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeclineInvite(invitation.id)}
                      disabled={submitting === invitation.id}
                    >
                      {submitting === invitation.id ? "Processing..." : "Decline"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No pending invitations</p>
          </CardContent>
        </Card>
      )}

      {/* Important Notice */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="text-orange-700 dark:text-orange-300">
            Important Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-700 dark:text-orange-300">
            Once accepted, you will need to visit your Current Events for more details. 
            If declined, you will be requested for feedback to be sent to the Host and this Event 
            will be removed from your invitations and placed in Event History.
          </p>
        </CardContent>
      </Card>

      {/* Invite Code Section */}
      <Card>
        <CardHeader>
          <CardTitle>Have an Invite Code?</CardTitle>
          <CardDescription>
            If you have been given an Invite Code and do not see the Event above, 
            please enter your Invite Code below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter your invite code"
            />
          </div>
          <Button onClick={handleSubmitInviteCode}>
            Submit Invite Code
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierInvitations;