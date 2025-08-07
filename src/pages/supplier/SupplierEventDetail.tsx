import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Building, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SupplierHeader from "@/components/supplier/SupplierHeader";
import { EventOverview } from "@/components/supplier/EventOverview";
import { TermsConditions } from "@/components/supplier/TermsConditions";
import { QualificationBids } from "@/components/supplier/QualificationBids";
import { LiveAuction } from "@/components/supplier/LiveAuction";
import { EventDocuments } from "@/components/supplier/EventDocuments";
import { EventMessages } from "@/components/supplier/EventMessages";

export default function SupplierEventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRemaining, setTimeRemaining] = useState("09:42");

  // Mock event data - replace with actual API call
  const event = {
    id: "57423",
    title: "Laptop Auction",
    description: "We are looking to source 20 laptops. These must be delivered to our London office.",
    status: "AUCTION IN PROGRESS",
    eventType: "Questionnaire + Qualification Bids + Auction",
    host: "John Smith",
    company: "Market Dojo",
    termsDeadline: "January 16, 2020 16:00 GMT",
    lots: [
      {
        id: 1,
        name: "Laptops",
        quantity: "20 x Each",
        yourPrice: "£250.00",
        totalValue: "£5,000.00",
        bidStatus: "Place Bid"
      }
    ]
  };

  useEffect(() => {
    if (!user) {
      navigate('/supplier/auth');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/supplier/auth');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AUCTION IN PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "LIVE":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <SupplierHeader user={user} onSignOut={handleSignOut} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Event Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Current
              </Badge>
              <h1 className="text-2xl font-bold">{event.title}</h1>
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Time Remaining: {timeRemaining}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">ID</div>
                <div className="font-medium">{event.id}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Event type</div>
                <div className="font-medium">{event.eventType}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Terms and Conditions Deadline</div>
                <div className="font-medium">{event.termsDeadline}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <Badge className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Host:</span>
                  <span className="font-medium">{event.host}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Company:</span>
                  <span className="font-medium">{event.company}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Terms and Conditions
            </TabsTrigger>
            <TabsTrigger value="qual-bids">Qual. Bids</TabsTrigger>
            <TabsTrigger value="auction" className="text-blue-600 font-medium">
              Auction
            </TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <EventOverview event={event} />
          </TabsContent>

          <TabsContent value="terms" className="mt-6">
            <TermsConditions 
              event={event} 
              onComplete={() => setActiveTab("qual-bids")} 
            />
          </TabsContent>

          <TabsContent value="qual-bids" className="mt-6">
            <QualificationBids 
              event={event} 
              onComplete={() => setActiveTab("auction")} 
            />
          </TabsContent>

          <TabsContent value="auction" className="mt-6">
            <LiveAuction event={event} />
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <EventDocuments event={event} />
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <EventMessages event={event} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}