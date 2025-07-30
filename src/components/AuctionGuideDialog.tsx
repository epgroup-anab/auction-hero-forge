import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Users, Settings, Gavel, Eye, Play } from "lucide-react";
import { useState } from "react";

interface AuctionGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartCreation: () => void;
}

export const AuctionGuideDialog = ({ open, onOpenChange, onStartCreation }: AuctionGuideDialogProps) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps = [
    {
      title: "1. Event Basic Setup",
      icon: FileText,
      description: "Configure event name, category, currency and brief description",
      details: [
        "Enter a clear event name (e.g., 'Q1 2024 Office Supplies Auction')",
        "Select appropriate category (Government, Corporate, etc.)",
        "Choose currency (USD, GBP, EUR) or enable multi-currency",
        "Write a brief description explaining what's being auctioned",
        "Enable auction and/or RFQ features as needed"
      ],
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "2. Auction Configuration",
      icon: Settings,
      description: "Set auction timing, bidding rules and behavior",
      details: [
        "Choose auction type: Ranked (traditional) or other formats",
        "Set bid direction: Reverse (suppliers compete with lower bids) or Forward",
        "Configure minimum/maximum bid change amounts",
        "Set minimum event duration (default: 10 minutes)",
        "Choose tied bid handling: Equal worst position or other rules",
        "Configure dynamic close period to prevent last-second bidding"
      ],
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "3. Lots Management",
      icon: Gavel,
      description: "Define what's being auctioned with quantities and specifications",
      details: [
        "Add individual lots (items) for the auction",
        "Set quantity and unit of measure for each lot",
        "Define qualification prices (starting/reserve prices)",
        "Add detailed specifications and requirements",
        "Upload images or documents for each lot",
        "Group related lots if needed"
      ],
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "4. Participant Management",
      icon: Users,
      description: "Invite suppliers and manage participant access",
      details: [
        "Add supplier contacts (name, email, company)",
        "Send invitations to participate in the auction",
        "Set auto-approval rules or manual approval process",
        "Configure participant requirements and qualifications",
        "Monitor registration and approval status",
        "Send follow-up messages to non-respondents"
      ],
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "5. Questionnaires (Optional)",
      icon: FileText,
      description: "Create qualification questionnaires for suppliers",
      details: [
        "Design custom questionnaires for supplier qualification",
        "Set pre-qualification requirements",
        "Configure scoring and weighting systems",
        "Set questionnaire deadlines",
        "Review and approve supplier responses",
        "Use responses to filter qualified participants"
      ],
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "6. Documents & Terms",
      icon: FileText,
      description: "Upload specifications and legal terms",
      details: [
        "Upload technical specifications and requirements",
        "Add terms and conditions documents",
        "Include supplier code of conduct",
        "Set data protection agreements",
        "Configure document sharing permissions",
        "Ensure all legal requirements are covered"
      ],
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      title: "7. Final Review & Launch",
      icon: Play,
      description: "Review all settings and publish the auction",
      details: [
        "Review event summary and all configurations",
        "Verify participant list and invitations sent",
        "Check document uploads and terms",
        "Confirm auction timing and rules",
        "Send final notifications to all participants",
        "Publish and monitor the live auction"
      ],
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  const handleStepClick = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Gavel className="h-6 w-6 text-primary" />
            Complete Auction Creation Guide
          </DialogTitle>
          <DialogDescription>
            Follow these comprehensive steps to create a successful auction event. Click on any step to see detailed instructions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isExpanded = expandedStep === index;
            
            return (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div 
                  className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${step.bgColor}`}
                  onClick={() => handleStepClick(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full bg-white shadow-sm`}>
                        <IconComponent className={`h-5 w-5 ${step.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${step.color} border-current`}>
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </Badge>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-4 bg-white border-t">
                    <h4 className="font-medium mb-3 text-foreground">Step Details:</h4>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              This guide will help you create professional auction events
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close Guide
            </Button>
            <Button onClick={() => {
              onStartCreation();
              onOpenChange(false);
            }}>
              <Play className="h-4 w-4 mr-2" />
              Start Creating Auction
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};