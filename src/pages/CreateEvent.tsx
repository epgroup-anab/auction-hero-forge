import { useState, useEffect } from "react";
import { ChevronLeft, Save, Send, FileText, Users, Settings, Calendar, Package, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Import all step components
import { EventBasicSetup } from "@/components/create-event/EventBasicSetup";
import { AuctionConfiguration } from "@/components/create-event/AuctionConfiguration";
import { QuestionnaireSetup } from "@/components/create-event/QuestionnaireSetup";
import { DocumentManagement } from "@/components/create-event/DocumentManagement";
import { TermsConditions } from "@/components/create-event/TermsConditions";
import { LotsManagement } from "@/components/create-event/LotsManagement";
import { ParticipantManagement } from "@/components/create-event/ParticipantManagement";
import { FinalOverview } from "@/components/create-event/FinalOverview";

interface EventData {
  name: string;
  category: string;
  default_currency: string;
  multi_currency: boolean;
  brief_text: string;
  includeAuction: boolean;
  includeQuestionnaire: boolean;
  includeRFQ: boolean;
  sealResults: boolean;
}

interface AuctionSettings {
  start_date?: Date;
  start_time: string;
  bid_direction: string;
  event_type: string;
  minimum_duration: number;
  dynamic_close_period: string;
  minimum_bid_change: number;
  maximum_bid_change: number;
  tied_bid_option: string;
}

interface Questionnaire {
  id?: string;
  name: string;
  deadline?: Date;
  pre_qualification: boolean;
  scoring: boolean;
  weighting: boolean;
  order_index: number;
}

interface Document {
  id?: string;
  name: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  version: string;
  shared_with_all: boolean;
}

interface Lot {
  id?: string;
  name: string;
  quantity: number;
  unit_of_measure: string;
  current_price?: number;
  qualification_price?: number;
  current_value?: number;
  qualification_value?: number;
}

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

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Event data states
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    category: "",
    default_currency: "GBP",
    multi_currency: false,
    brief_text: "",
    includeAuction: false,
    includeQuestionnaire: false,
    includeRFQ: false,
    sealResults: true
  });

  const [auctionSettings, setAuctionSettings] = useState<AuctionSettings>({
    start_time: "09:00",
    bid_direction: "reverse",
    event_type: "ranked",
    minimum_duration: 10,
    dynamic_close_period: "none",
    minimum_bid_change: 0.50,
    maximum_bid_change: 10.00,
    tied_bid_option: "equal_worst_position"
  });

  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [eventParticipants, setEventParticipants] = useState<EventParticipant[]>([]);
  const [autoAccept, setAutoAccept] = useState(false);

  const steps = [
    { id: 1, name: "Event Setup", icon: FileText, completed: false },
    { id: 2, name: "Auction Config", icon: Settings, completed: false },
    { id: 3, name: "Questionnaire", icon: Calendar, completed: false },
    { id: 4, name: "Documents", icon: Upload, completed: false },
    { id: 5, name: "Terms & Conditions", icon: FileText, completed: false },
    { id: 6, name: "RFQ Lots", icon: Package, completed: false },
    { id: 7, name: "Participants", icon: Users, completed: false },
    { id: 8, name: "Final Overview", icon: CheckCircle, completed: false }
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

  const saveCompleteEvent = async (status: 'draft' | 'published') => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      console.log('Starting event creation with data:', { eventData, auctionSettings, questionnaires, documents, lots, eventParticipants });
      
      // 1. Create the main event
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          name: eventData.name,
          category: eventData.category,
          default_currency: eventData.default_currency,
          multi_currency: eventData.multi_currency,
          brief_text: eventData.brief_text,
          include_auction: eventData.includeAuction,
          include_questionnaire: eventData.includeQuestionnaire,
          include_rfq: eventData.includeRFQ,
          seal_results: eventData.sealResults,
          status
        })
        .select()
        .single();

      if (eventError) {
        console.error('Event creation error:', eventError);
        throw eventError;
      }

      console.log('Event created:', event);

      // 2. Save auction settings if auction is enabled
      if (eventData.includeAuction && event.id) {
        const { error: auctionError } = await supabase
          .from('auction_settings')
          .insert({
            event_id: event.id,
            start_date: auctionSettings.start_date?.toISOString(),
            start_time: auctionSettings.start_time,
            bid_direction: auctionSettings.bid_direction,
            event_type: auctionSettings.event_type,
            minimum_duration: auctionSettings.minimum_duration,
            dynamic_close_period: auctionSettings.dynamic_close_period,
            minimum_bid_change: auctionSettings.minimum_bid_change,
            maximum_bid_change: auctionSettings.maximum_bid_change,
            tied_bid_option: auctionSettings.tied_bid_option
          });

        if (auctionError) {
          console.error('Auction settings error:', auctionError);
          throw auctionError;
        }
        console.log('Auction settings saved');
      }

      // 3. Save questionnaires if questionnaire is enabled
      if (eventData.includeQuestionnaire && questionnaires.length > 0 && event.id) {
        const questionnaireInserts = questionnaires.map(q => ({
          event_id: event.id,
          name: q.name,
          deadline: q.deadline?.toISOString(),
          pre_qualification: q.pre_qualification,
          scoring: q.scoring,
          weighting: q.weighting,
          order_index: q.order_index
        }));

        const { error: questionnaireError } = await supabase
          .from('questionnaires')
          .insert(questionnaireInserts);

        if (questionnaireError) {
          console.error('Questionnaire error:', questionnaireError);
          throw questionnaireError;
        }
        console.log('Questionnaires saved');
      }

      // 4. Save documents
      if (documents.length > 0 && event.id) {
        const documentInserts = documents.map(d => ({
          event_id: event.id,
          name: d.name,
          file_path: d.file_path,
          file_size: d.file_size,
          mime_type: d.mime_type,
          version: d.version,
          shared_with_all: d.shared_with_all
        }));

        const { error: documentError } = await supabase
          .from('documents')
          .insert(documentInserts);

        if (documentError) {
          console.error('Document error:', documentError);
          throw documentError;
        }
        console.log('Documents saved');
      }

      // 5. Save lots if RFQ is enabled
      if (eventData.includeRFQ && lots.length > 0 && event.id) {
        const lotInserts = lots.map(l => ({
          event_id: event.id,
          name: l.name,
          quantity: l.quantity,
          unit_of_measure: l.unit_of_measure,
          current_price: l.current_price,
          qualification_price: l.qualification_price,
          current_value: l.current_value,
          qualification_value: l.qualification_value
        }));

        const { error: lotError } = await supabase
          .from('lots')
          .insert(lotInserts);

        if (lotError) {
          console.error('Lot error:', lotError);
          throw lotError;
        }
        console.log('Lots saved');
      }

      // 6. Save participants
      if (eventParticipants.length > 0 && event.id) {
        // First ensure participants exist in participants table
        for (const ep of eventParticipants) {
          const { error: participantError } = await supabase
            .from('participants')
            .upsert({
              email: ep.participant.email,
              name: ep.participant.name,
              company: ep.participant.company
            }, {
              onConflict: 'email'
            });

          if (participantError) {
            console.error('Participant upsert error:', participantError);
            throw participantError;
          }
        }

        // Get participant IDs and create event_participants records
        const { data: participantData, error: participantFetchError } = await supabase
          .from('participants')
          .select('id, email')
          .in('email', eventParticipants.map(ep => ep.participant.email));

        if (participantFetchError) {
          console.error('Participant fetch error:', participantFetchError);
          throw participantFetchError;
        }

        const eventParticipantInserts = eventParticipants.map(ep => {
          const participant = participantData?.find(p => p.email === ep.participant.email);
          return {
            event_id: event.id,
            participant_id: participant?.id,
            status: ep.status,
            approved: ep.approved,
            auto_accept: autoAccept,
            questionnaires_completed: ep.questionnaires_completed,
            lots_entered: ep.lots_entered
          };
        });

        const { error: eventParticipantError } = await supabase
          .from('event_participants')
          .insert(eventParticipantInserts);

        if (eventParticipantError) {
          console.error('Event participant error:', eventParticipantError);
          throw eventParticipantError;
        }
        console.log('Event participants saved');
      }

      toast({
        title: status === 'draft' ? "Draft saved" : "Event launched!",
        description: status === 'draft' 
          ? "Your event has been saved as a draft." 
          : "Your event has been successfully launched and is now live.",
      });

      navigate('/');
    } catch (error: any) {
      console.error('Complete error object:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => saveCompleteEvent('draft');
  const handleLaunchEvent = () => {
    if (!eventData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an event name before launching.",
        variant: "destructive",
      });
      return;
    }
    saveCompleteEvent('published');
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
          <EventBasicSetup 
            eventData={eventData} 
            setEventData={setEventData} 
          />
        );
      case 2:
        return (
          <AuctionConfiguration 
            includeAuction={eventData.includeAuction}
            auctionSettings={auctionSettings}
            setAuctionSettings={setAuctionSettings}
          />
        );
      case 3:
        return (
          <QuestionnaireSetup 
            includeQuestionnaire={eventData.includeQuestionnaire}
            questionnaires={questionnaires}
            setQuestionnaires={setQuestionnaires}
          />
        );
      case 4:
        return (
          <DocumentManagement 
            documents={documents}
            setDocuments={setDocuments}
          />
        );
      case 5:
        return (
          <TermsConditions 
            includeQuestionnaire={eventData.includeQuestionnaire}
          />
        );
      case 6:
        return (
          <LotsManagement 
            includeRFQ={eventData.includeRFQ}
            lots={lots}
            setLots={setLots}
            currency={eventData.default_currency}
          />
        );
      case 7:
        return (
          <ParticipantManagement 
            eventParticipants={eventParticipants}
            setEventParticipants={setEventParticipants}
            autoAccept={autoAccept}
            setAutoAccept={setAutoAccept}
          />
        );
      case 8:
        return (
          <FinalOverview 
            eventData={eventData}
            questionnaires={questionnaires}
            documents={documents}
            lots={lots}
            eventParticipants={eventParticipants}
          />
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
            <p className="text-muted-foreground">Set up your comprehensive auction or RFQ event</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-2 min-w-fit">
              <div className="flex items-center space-x-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all text-xs ${
                  currentStep === step.id 
                    ? 'border-primary bg-primary text-primary-foreground' 
                    : currentStep > step.id 
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-muted-foreground bg-background text-muted-foreground'
                }`}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <div className="space-y-1">
                  <p className={`text-xs font-medium ${
                    currentStep === step.id ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.name}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="w-4 h-px bg-border"></div>
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
            <div className="p-4">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
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
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <h3 className="font-semibold mb-3">Event Progress</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Components Selected:</span>
                  <span>{[eventData.includeRFQ, eventData.includeAuction, eventData.includeQuestionnaire].filter(Boolean).length}/3</span>
                </div>
                <div className="flex justify-between">
                  <span>Documents:</span>
                  <span>{documents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lots:</span>
                  <span>{lots.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Participants:</span>
                  <span>{eventParticipants.length}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Our comprehensive event setup wizard guides you through each step to ensure your auction or RFQ is configured correctly.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Guide
              </Button>
            </div>
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
                variant="default" 
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