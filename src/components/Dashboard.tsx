import { Calendar, Clock, Users, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const draftEvents = [
    {
      id: "AUC-001",
      name: "Office Equipment Procurement",
      type: "RFQ",
      deadline: "2024-02-15",
      status: "draft",
      participants: 0
    },
    {
      id: "AUC-002", 
      name: "IT Services Contract",
      type: "Auction",
      deadline: "2024-02-20",
      status: "draft",
      participants: 0
    }
  ];

  const currentEvents = [
    {
      id: "AUC-003",
      name: "Facility Maintenance Services", 
      type: "RFQ",
      deadline: "2024-02-10",
      status: "active",
      participants: 12,
      responses: 8,
      savings: "15.2%"
    },
    {
      id: "AUC-004",
      name: "Marketing Materials Auction",
      type: "Auction", 
      deadline: "2024-02-12",
      status: "active",
      participants: 25,
      responses: 23,
      savings: "22.7%"
    }
  ];

  const recentMessages = [
    {
      from: "TechCorp Solutions",
      event: "IT Services Contract", 
      message: "Question about technical requirements...",
      time: "2 hours ago",
      unread: true
    },
    {
      from: "Global Supplies Ltd",
      event: "Office Equipment Procurement",
      message: "Delivery timeline clarification needed",
      time: "4 hours ago", 
      unread: true
    },
    {
      from: "Premium Services Inc",
      event: "Facility Maintenance Services",
      message: "Thank you for the award notification",
      time: "1 day ago",
      unread: false
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">248</div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">18.9%</div>
            <p className="text-xs text-muted-foreground">vs. baseline pricing</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">7</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Draft Events */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Draft Events
            </CardTitle>
            <CardDescription>Events awaiting launch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {draftEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{event.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">{event.type}</Badge>
                    <span>#{event.id}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Continue
                </Button>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-accent hover:text-accent-foreground">
              View All Drafts
            </Button>
          </CardContent>
        </Card>

        {/* Current Events */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Current Events
            </CardTitle>
            <CardDescription>Active auctions and RFQs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentEvents.map((event) => (
              <div key={event.id} className="p-4 bg-muted/30 rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{event.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{event.type}</Badge>
                      <span>#{event.id}</span>
                      <span>Deadline: {event.deadline}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    {event.savings} savings
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Participation</span>
                      <span>{event.responses}/{event.participants}</span>
                    </div>
                    <Progress 
                      value={(event.responses / event.participants) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="space-y-1">
                  <p className="font-medium text-sm">Facility Maintenance Services</p>
                  <p className="text-xs text-muted-foreground">RFQ Deadline</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-warning">Feb 10</p>
                  <p className="text-xs text-muted-foreground">2 days</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="space-y-1">
                  <p className="font-medium text-sm">Marketing Materials Auction</p>
                  <p className="text-xs text-muted-foreground">Auction Close</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">Feb 12</p>
                  <p className="text-xs text-muted-foreground">4 days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Recent Messages
            </CardTitle>
            <CardDescription>Latest communications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMessages.map((message, index) => (
              <div key={index} className={`p-3 rounded-lg border ${message.unread ? 'bg-accent/10 border-accent/20' : 'bg-muted/30'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{message.from}</p>
                    <p className="text-xs text-muted-foreground">{message.event}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {message.unread && <div className="h-2 w-2 bg-accent rounded-full" />}
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{message.message}</p>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-accent hover:text-accent-foreground">
              View All Messages
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;