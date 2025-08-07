import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  LogOut, 
  Mail, 
  Package,
  Gavel,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AuctionEvent {
  id: string;
  title: string;
  description: string;
  status: 'invited' | 'active' | 'submitted' | 'closed';
  deadline: string;
  category: string;
  estimatedValue: string;
  lots: number;
}

const SupplierDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<AuctionEvent[]>([
    {
      id: "1",
      title: "Government Office Supplies Procurement",
      description: "Annual procurement of office supplies including stationery, furniture, and IT equipment",
      status: "active",
      deadline: "2024-02-15T17:00:00Z",
      category: "Office Supplies",
      estimatedValue: "£250,000",
      lots: 12
    },
    {
      id: "2", 
      title: "Municipal Road Maintenance Equipment",
      description: "Procurement of road maintenance equipment and tools for city infrastructure",
      status: "invited",
      deadline: "2024-02-20T12:00:00Z",
      category: "Construction",
      estimatedValue: "£180,000",
      lots: 8
    },
    {
      id: "3",
      title: "Hospital Medical Supplies Contract",
      description: "Supply of essential medical equipment and consumables for regional hospital",
      status: "submitted",
      deadline: "2024-02-10T15:30:00Z", 
      category: "Healthcare",
      estimatedValue: "£420,000",
      lots: 15
    }
  ]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/supplier/auth');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'invited': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'submitted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Gavel className="h-4 w-4" />;
      case 'invited': return <Mail className="h-4 w-4" />;
      case 'submitted': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/supplier/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Supplier Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'S'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Supplier Account</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">
            Manage your auction invitations and track your bidding activity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Active Invitations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm text-muted-foreground">Submitted Bids</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold">£850K</p>
                  <p className="text-sm text-muted-foreground">Total Opportunity Value</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold">35</p>
                  <p className="text-sm text-muted-foreground">Total Lots</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Opportunities */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Your Auction Opportunities</h3>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>

          <div className="grid gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="text-base">
                        {event.description}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(event.status)} flex items-center gap-1`}>
                      {getStatusIcon(event.status)}
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Deadline:</strong> {formatDeadline(event.deadline)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Value:</strong> {event.estimatedValue}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Lots:</strong> {event.lots}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Category:</strong> {event.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {event.status === 'invited' && (
                        <>
                          <Button size="sm">
                            <Gavel className="h-4 w-4 mr-2" />
                            Start Bidding
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Documents
                          </Button>
                        </>
                      )}
                      {event.status === 'active' && (
                        <>
                           <Button 
                             size="sm"
                             onClick={() => navigate(`/supplier/event/${event.id}`)}
                           >
                             <Gavel className="h-4 w-4 mr-2" />
                             Continue Bidding
                           </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Progress
                          </Button>
                        </>
                      )}
                      {event.status === 'submitted' && (
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          View Submission
                        </Button>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Event ID: {event.id}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupplierDashboard;