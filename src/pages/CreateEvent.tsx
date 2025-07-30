import { useState, useEffect } from "react";
import { ChevronLeft, Save, Send, FileText, Users, Settings, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventData, setEventData] = useState({
    name: "",
    category: "",
    currency: "USD",
    description: "",
    includeAuction: false,
    includeQuestionnaire: false,
    includeRFQ: false,
    sealResults: true
  });

  const steps = [
    { id: 1, name: "Basic Setup", icon: FileText, completed: false },
    { id: 2, name: "Configuration", icon: Settings, completed: false },
    { id: 3, name: "Participants", icon: Users, completed: false },
    { id: 4, name: "Review & Launch", icon: Send, completed: false }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveEvent = async (status: 'draft' | 'published') => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          name: eventData.name,
          category: eventData.category,
          currency: eventData.currency,
          description: eventData.description,
          include_auction: eventData.includeAuction,
          include_questionnaire: eventData.includeQuestionnaire,
          include_rfq: eventData.includeRFQ,
          seal_results: eventData.sealResults,
          status
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: status === 'draft' ? "Draft saved" : "Event launched!",
        description: status === 'draft' 
          ? "Your event has been saved as a draft." 
          : "Your event has been successfully launched and is now live.",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => saveEvent('draft');
  const handleLaunchEvent = () => {
    if (!eventData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an event name before launching.",
        variant: "destructive",
      });
      return;
    }
    saveEvent('published');
  };

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name *</Label>
                <Input
                  id="eventName"
                  placeholder="e.g., Office Equipment Procurement 2024"
                  value={eventData.name}
                  onChange={(e) => setEventData({...eventData, name: e.target.value})}
                  className="text-base"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Event Category</Label>
                  <Select value={eventData.category} onValueChange={(value) => setEventData({...eventData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government">Government Procurement</SelectItem>
                      <SelectItem value="corporate">Corporate Sourcing</SelectItem>
                      <SelectItem value="services">Professional Services</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="it">IT & Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={eventData.currency} onValueChange={(value) => setEventData({...eventData, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Event Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of your procurement requirements..."
                  value={eventData.description}
                  onChange={(e) => setEventData({...eventData, description: e.target.value})}
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Event Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer transition-all hover:shadow-md" 
                      onClick={() => setEventData({...eventData, includeRFQ: !eventData.includeRFQ})}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox checked={eventData.includeRFQ} className="mt-1" />
                      <div>
                        <h4 className="font-medium">Include RFQ</h4>
                        <p className="text-sm text-muted-foreground">Request detailed quotes from suppliers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all hover:shadow-md"
                      onClick={() => setEventData({...eventData, includeAuction: !eventData.includeAuction})}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox checked={eventData.includeAuction} className="mt-1" />
                      <div>
                        <h4 className="font-medium">Include Online Auction</h4>
                        <p className="text-sm text-muted-foreground">Real-time competitive bidding</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all hover:shadow-md"
                      onClick={() => setEventData({...eventData, includeQuestionnaire: !eventData.includeQuestionnaire})}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox checked={eventData.includeQuestionnaire} className="mt-1" />
                      <div>
                        <h4 className="font-medium">Include Questionnaire</h4>
                        <p className="text-sm text-muted-foreground">Collect qualitative responses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all hover:shadow-md"
                      onClick={() => setEventData({...eventData, sealResults: !eventData.sealResults})}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox checked={eventData.sealResults} className="mt-1" />
                      <div>
                        <h4 className="font-medium">Seal Results</h4>
                        <p className="text-sm text-muted-foreground">Hide results until deadline</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Advanced Configuration</h3>
              <p className="text-muted-foreground">
                Configure auction timing, questionnaire setup, and document management.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                This step will be implemented in the next iteration.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Participant Management</h3>
              <p className="text-muted-foreground">
                Invite and manage suppliers for your event.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                This step will be implemented in the next iteration.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Review & Launch</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Event Summary</CardTitle>
                <CardDescription>Review your event configuration before launching</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Event Name</Label>
                    <p className="text-sm text-muted-foreground">{eventData.name || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <p className="text-sm text-muted-foreground">{eventData.category || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Currency</Label>
                    <p className="text-sm text-muted-foreground">{eventData.currency}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Components</Label>
                    <div className="flex gap-2 mt-1">
                      {eventData.includeRFQ && <Badge variant="secondary">RFQ</Badge>}
                      {eventData.includeAuction && <Badge variant="secondary">Auction</Badge>}
                      {eventData.includeQuestionnaire && <Badge variant="secondary">Questionnaire</Badge>}
                      {eventData.sealResults && <Badge variant="secondary">Sealed</Badge>}
                    </div>
                  </div>
                </div>
                
                {eventData.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground mt-1">{eventData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <h4 className="font-medium text-accent-foreground mb-2">Ready to Launch?</h4>
              <p className="text-sm text-muted-foreground">
                Once launched, you'll be able to manage participants, monitor responses, and track your event progress.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Event</h1>
            <p className="text-muted-foreground">Set up your auction or RFQ event</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4 overflow-x-auto pb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-4 min-w-fit">
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  currentStep === step.id 
                    ? 'border-primary bg-primary text-primary-foreground' 
                    : currentStep > step.id 
                      ? 'border-success bg-success text-success-foreground'
                      : 'border-muted-foreground bg-background text-muted-foreground'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className={`text-sm font-medium ${
                    currentStep === step.id ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.name}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-px bg-border"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-8">
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" disabled>
                <FileText className="h-4 w-4 mr-2" />
                Load Template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Our event setup wizard guides you through each step to ensure your auction or RFQ is configured correctly.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        <div className="flex items-center gap-3">
          {currentStep === steps.length ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                Save as Draft
              </Button>
              <Button 
                variant="premium" 
                className="min-w-[120px]" 
                onClick={handleLaunchEvent}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Launching..." : "Launch Event"}
              </Button>
            </>
          ) : (
            <Button onClick={handleNext} className="min-w-[120px]">
              Next Step
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;