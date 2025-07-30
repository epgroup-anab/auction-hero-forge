import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Package, FileText } from "lucide-react";

interface FinalOverviewProps {
  eventData: any;
  questionnaires: any[];
  documents: any[];
  lots: any[];
  eventParticipants: any[];
}

export const FinalOverview = ({ 
  eventData, 
  questionnaires, 
  documents, 
  lots, 
  eventParticipants 
}: FinalOverviewProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Event Summary
          </CardTitle>
          <CardDescription>Review your complete event configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Event Details</h4>
              <p className="text-sm text-muted-foreground">{eventData.name}</p>
              <p className="text-xs text-muted-foreground">{eventData.category}</p>
            </div>
            <div>
              <h4 className="font-medium">Currency</h4>
              <p className="text-sm text-muted-foreground">{eventData.default_currency}</p>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {eventData.includeRFQ && <Badge>RFQ</Badge>}
            {eventData.includeAuction && <Badge>Auction</Badge>}
            {eventData.includeQuestionnaire && <Badge>Questionnaire</Badge>}
            {eventData.sealResults && <Badge variant="outline">Sealed Results</Badge>}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{eventParticipants.length}</p>
            <p className="text-sm text-muted-foreground">Invited</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" />
              Lots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{lots.length}</p>
            <p className="text-sm text-muted-foreground">Created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{documents.length}</p>
            <p className="text-sm text-muted-foreground">Uploaded</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <h4 className="font-medium text-accent-foreground mb-2">Ready to Launch?</h4>
        <p className="text-sm text-muted-foreground">
          Your event is configured and ready. Once launched, participants will receive invitations and can begin responding.
        </p>
      </div>
    </div>
  );
};