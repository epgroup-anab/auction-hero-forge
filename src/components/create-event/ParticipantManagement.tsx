import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, CheckCircle, XCircle, Trash2, Mail } from "lucide-react";

interface Participant {
  id?: string;
  email: string;
  name?: string;
  company?: string;
}

interface EventParticipant {
  participant: Participant;
  status: 'invited' | 'registered' | 'not_accepted';
  approved: boolean;
  questionnaires_completed: number;
  lots_entered: number;
  invited_at: Date;
}

interface ParticipantManagementProps {
  eventParticipants: EventParticipant[];
  setEventParticipants: (participants: EventParticipant[]) => void;
  autoAccept: boolean;
  setAutoAccept: (autoAccept: boolean) => void;
}

// Mock participant database
const participantDatabase: Participant[] = [
  { id: "1", email: "sandpit1@marketdojo.com", name: "Participant-1", company: "Supplier Corp A" },
  { id: "2", email: "sandpit2@marketdojo.com", name: "Participant-2", company: "Supplier Corp B" },
  { id: "3", email: "sandpit3@marketdojo.com", name: "Participant-3", company: "Supplier Corp C" },
  { id: "4", email: "john.supplier@techcorp.com", name: "John Smith", company: "Tech Corp" },
  { id: "5", email: "sarah.vendor@solutions.com", name: "Sarah Johnson", company: "Solutions Ltd" }
];

export const ParticipantManagement = ({ 
  eventParticipants, 
  setEventParticipants,
  autoAccept,
  setAutoAccept 
}: ParticipantManagementProps) => {
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>("");

  const handleAddParticipant = () => {
    const participant = participantDatabase.find(p => p.id === selectedParticipantId);
    if (!participant) return;

    // Check if participant already added
    const exists = eventParticipants.some(ep => ep.participant.email === participant.email);
    if (exists) return;

    const newEventParticipant: EventParticipant = {
      participant,
      status: 'invited',
      approved: autoAccept,
      questionnaires_completed: 0,
      lots_entered: 0,
      invited_at: new Date()
    };

    setEventParticipants([...eventParticipants, newEventParticipant]);
    setSelectedParticipantId("");
    setIsAddParticipantOpen(false);
  };

  const removeParticipant = (index: number) => {
    const filtered = eventParticipants.filter((_, i) => i !== index);
    setEventParticipants(filtered);
  };

  const toggleApproval = (index: number) => {
    const updated = eventParticipants.map((ep, i) => 
      i === index ? { ...ep, approved: !ep.approved } : ep
    );
    setEventParticipants(updated);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'registered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'not_accepted':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Mail className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'registered':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Registered</Badge>;
      case 'not_accepted':
        return <Badge variant="destructive">Not accepted invite</Badge>;
      default:
        return <Badge variant="secondary">Invited</Badge>;
    }
  };

  // Calculate summary statistics
  const totalInvolved = eventParticipants.length;
  const totalApproved = eventParticipants.filter(ep => ep.approved).length;
  const totalRegistered = eventParticipants.filter(ep => ep.status === 'registered').length;
  const totalAccepted = eventParticipants.filter(ep => ep.status !== 'not_accepted').length;
  const fullCompletion = eventParticipants.filter(ep => ep.questionnaires_completed > 0 && ep.lots_entered > 0).length;
  const partialCompletion = eventParticipants.filter(ep => ep.questionnaires_completed > 0 || ep.lots_entered > 0).length - fullCompletion;
  const noneCompletion = eventParticipants.filter(ep => ep.questionnaires_completed === 0 && ep.lots_entered === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Participant Management</h3>
          <p className="text-sm text-muted-foreground">
            Invite and manage suppliers for your event
          </p>
        </div>
        <Dialog open={isAddParticipantOpen} onOpenChange={setIsAddParticipantOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Participant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Participant</DialogTitle>
              <DialogDescription>
                Select a participant from your database to invite to this event.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Pick from Participant Database</Label>
                <Select value={selectedParticipantId} onValueChange={setSelectedParticipantId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select participant" />
                  </SelectTrigger>
                  <SelectContent>
                    {participantDatabase
                      .filter(p => !eventParticipants.some(ep => ep.participant.email === p.email))
                      .map(participant => (
                        <SelectItem key={participant.id} value={participant.id!}>
                          <div className="flex flex-col">
                            <span>{participant.name}</span>
                            <span className="text-sm text-muted-foreground">{participant.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddParticipantOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddParticipant} disabled={!selectedParticipantId}>
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {eventParticipants.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Event Participants ({eventParticipants.length})</CardTitle>
              <CardDescription>
                Participant invitations have been sent. Monitor their status and participation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Approval</th>
                        <th className="text-left p-2">Participant</th>
                        <th className="text-left p-2">Invited</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Questionnaires Completed</th>
                        <th className="text-left p-2">Lots Entered</th>
                        <th className="text-left p-2">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventParticipants.map((eventParticipant, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">
                            <Checkbox
                              checked={eventParticipant.approved}
                              onCheckedChange={() => toggleApproval(index)}
                            />
                          </td>
                          <td className="p-2">
                            <div>
                              <p className="font-medium">{eventParticipant.participant.name}</p>
                              <p className="text-sm text-muted-foreground">{eventParticipant.participant.email}</p>
                              {eventParticipant.participant.company && (
                                <p className="text-xs text-muted-foreground">{eventParticipant.participant.company}</p>
                              )}
                            </div>
                          </td>
                          <td className="p-2">
                            <span className="text-sm">Through platform</span>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(eventParticipant.status)}
                              {getStatusBadge(eventParticipant.status)}
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <span className="text-sm">{eventParticipant.questionnaires_completed}/1</span>
                          </td>
                          <td className="p-2 text-center">
                            <span className="text-sm">{eventParticipant.lots_entered}/1</span>
                          </td>
                          <td className="p-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeParticipant(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{totalInvolved}</p>
                  <p className="text-sm text-muted-foreground">Involved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{totalApproved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{totalRegistered}</p>
                  <p className="text-sm text-muted-foreground">Registered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{totalAccepted}</p>
                  <p className="text-sm text-muted-foreground">Accepted</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-green-600">{fullCompletion}</p>
                  <p className="text-sm text-muted-foreground">Full</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-yellow-600">{partialCompletion}</p>
                  <p className="text-sm text-muted-foreground">Partial</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-red-600">{noneCompletion}</p>
                  <p className="text-sm text-muted-foreground">None</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="autoAccept" 
          checked={autoAccept}
          onCheckedChange={(checked) => setAutoAccept(checked as boolean)}
        />
        <Label htmlFor="autoAccept">Do you want to automatically accept participants?</Label>
      </div>

      {eventParticipants.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No participants invited yet</p>
          <p className="text-sm text-muted-foreground">Add participants to start collecting responses</p>
        </div>
      )}
    </div>
  );
};