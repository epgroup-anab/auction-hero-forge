import { useEffect, useState } from "react";
import { Calendar, Clock, Users, MessageSquare, TrendingUp, AlertCircle, Eye, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  name: string;
  status: string;
  include_auction: boolean;
  include_questionnaire: boolean;
  include_rfq: boolean;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const draftEvents = events.filter(event => event.status === 'draft');
  const activeEvents = events.filter(event => event.status === 'published');
  const totalEvents = events.length;

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
            <div className="text-2xl font-bold text-primary">{activeEvents.length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">Total events created</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{draftEvents.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting publication</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/create-event')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
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
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Loading...</div>
            ) : draftEvents.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p>No draft events</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/create-event')}
                >
                  Create Your First Event
                </Button>
              </div>
            ) : (
              draftEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{event.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {event.include_auction && event.include_rfq ? 'Auction + RFQ' : 
                         event.include_auction ? 'Auction' : 
                         event.include_rfq ? 'RFQ' : 'Event'}
                      </Badge>
                      <span>Created: {new Date(event.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/create-event?eventId=${event.id}`)}
                  >
                    Continue
                  </Button>
                </div>
              ))
            )}
            <Button 
              variant="ghost" 
              className="w-full text-accent hover:text-accent-foreground"
              onClick={() => navigate('/my-events')}
            >
              <Eye className="h-4 w-4 mr-2" />
              View All Events
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
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Loading...</div>
            ) : activeEvents.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p>No active events</p>
                <p className="text-sm">Publish your events to see them here</p>
              </div>
            ) : (
              activeEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="p-4 bg-muted/30 rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{event.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">
                          {event.include_auction && event.include_rfq ? 'Auction + RFQ' : 
                           event.include_auction ? 'Auction' : 
                           event.include_rfq ? 'RFQ' : 'Event'}
                        </Badge>
                        <span>Created: {new Date(event.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                      Published
                    </Badge>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/my-events')}
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              ))
            )}
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
              {activeEvents.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <p>No upcoming deadlines</p>
                  <p className="text-sm">Create and publish events to track deadlines</p>
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <p>Event deadline tracking will be available once auction dates are configured</p>
                </div>
              )}
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
            <div className="p-4 text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>No messages yet</p>
              <p className="text-sm">Participant communications will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;