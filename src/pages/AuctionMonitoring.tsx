import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Clock, Users, Award, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { AwardLotsDialog } from "@/components/AwardLotsDialog";

export default function AuctionMonitoring() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState("14:32");
  const [showAwardDialog, setShowAwardDialog] = useState(false);

  // Mock auction data
  const auctionData = {
    id: "58168",
    title: "IT Hardware",
    status: "AUCTION IN PROGRESS",
    eventType: "Questionnaire + RFQ",
    termsDeadline: "February 10, 2020 21:20 GMT",
    host: "John Smith",
    company: "Market Dojo",
    lots: [
      {
        id: 1,
        name: "Laptops",
        currentValue: "£2,000.00",
        qualValue: "£2,000.00",
        bestBidValue: "£1,800.00",
        leadParticipant: "Participant-2",
        savingsOffered: "£200.00 (10.00%)",
        numBids: 2,
        bids: [
          {
            participant: "Participant-1",
            bidValue: "£1,900.00",
            rank: 2,
            savings: "£100.00 (5.00%)"
          },
          {
            participant: "Participant-2", 
            bidValue: "£1,800.00",
            rank: 1,
            savings: "£200.00 (10.00%)"
          }
        ]
      }
    ],
    participants: [
      { id: 1, name: "Participant-1", company: "Tech Corp", status: "Active" },
      { id: 2, name: "Participant-2", company: "Hardware Ltd", status: "Active" }
    ]
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);


  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Auction Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Current
              </Badge>
              <h1 className="text-2xl font-bold">{auctionData.title}</h1>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Time Remaining: {timeRemaining}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Terms & conditions Deadline: 4 days</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">ID</div>
                <div className="font-medium">{auctionData.id}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Event type</div>
                <div className="font-medium">{auctionData.eventType}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Host</div>
                <div className="font-medium">{auctionData.host}</div>
                <div className="text-sm text-muted-foreground">Company: {auctionData.company}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Terms & conditions Deadline</div>
                <div className="font-medium">{auctionData.termsDeadline}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="terms">Terms & conditions</TabsTrigger>
            <TabsTrigger value="rfqs" className="bg-blue-50 text-blue-700 font-medium">RFQs</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              Messages
              <Badge variant="destructive" className="text-xs">1</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Auction Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Current Status</h3>
                    <Badge className="bg-green-100 text-green-800">AUCTION IN PROGRESS</Badge>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Total Participants</h3>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{auctionData.participants.length} Active Participants</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auctionData.participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>{participant.name}</TableCell>
                        <TableCell>{participant.company}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {participant.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rfqs" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button 
                  className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Expand Participants
                </Button>
                <AwardLotsDialog 
                  lots={auctionData.lots}
                  isOpen={showAwardDialog}
                  onOpenChange={setShowAwardDialog}
                />
              </div>

              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>LOT NAME</TableHead>
                        <TableHead>CURRENT VALUE</TableHead>
                        <TableHead>QUAL VALUE</TableHead>
                        <TableHead>BEST BID VALUE</TableHead>
                        <TableHead>LEAD PARTICIPANT</TableHead>
                        <TableHead>SAVINGS OFFERED</TableHead>
                        <TableHead># BIDS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auctionData.lots.map((lot) => (
                        <TableRow key={lot.id}>
                          <TableCell className="font-medium">{lot.id}.</TableCell>
                          <TableCell>{lot.name}</TableCell>
                          <TableCell>{lot.currentValue}</TableCell>
                          <TableCell>{lot.qualValue}</TableCell>
                          <TableCell className="text-blue-600 font-medium">{lot.bestBidValue}</TableCell>
                          <TableCell className="text-blue-600">{lot.leadParticipant}</TableCell>
                          <TableCell className="text-green-600">{lot.savingsOffered}</TableCell>
                          <TableCell>{lot.numBids}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2 border-gray-200">
                        <TableCell className="font-bold">Totals</TableCell>
                        <TableCell></TableCell>
                        <TableCell className="font-bold">£2,000.00</TableCell>
                        <TableCell className="font-bold">£2,000.00</TableCell>
                        <TableCell className="font-bold text-blue-600">£1,800.00</TableCell>
                        <TableCell></TableCell>
                        <TableCell className="font-bold text-green-600">£200.00 (10.00%)</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="terms" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Terms and conditions management for the auction.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Auction documents and attachments.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Communication with auction participants.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}