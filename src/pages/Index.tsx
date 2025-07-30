import Dashboard from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <main className="container mx-auto px-6 py-8 flex items-center justify-center">
        <div>Loading...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container mx-auto px-6 py-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Welcome to AUCTION HERO
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Your premium platform for managing government auctions, RFQs, and tender processes.
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Get Started Today</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of organizations using our platform to streamline their auction processes.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={() => navigate('/auth')}>
                  Sign In as Host
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/supplier/dashboard')}>
                  Supplier Portal
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">🏛️ Government Auctions</h3>
                <p className="text-sm text-muted-foreground">
                  Manage public sector auctions with full transparency and compliance.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">📋 RFQ Management</h3>
                <p className="text-sm text-muted-foreground">
                  Streamline your Request for Quotation processes efficiently.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">📊 Tender Processes</h3>
                <p className="text-sm text-muted-foreground">
                  Handle complex tender evaluations with advanced tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your auction events.</p>
      </div>
      <Dashboard />
    </main>
  );
};

export default Index;