import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Upload, Eye, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const TermsConditionsContent = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<any[]>([]);
  const [customTerms, setCustomTerms] = useState<any[]>([]);

  const sampleDocuments = [
    {
      name: "Standard Terms & Conditions",
      description: "General terms and conditions for auction participation",
      size: "2.4 MB",
      type: "PDF"
    },
    {
      name: "Supplier Code of Conduct",
      description: "Ethical guidelines and compliance requirements",
      size: "1.8 MB", 
      type: "PDF"
    },
    {
      name: "Data Protection Agreement",
      description: "Privacy and data handling terms",
      size: "1.2 MB",
      type: "PDF"
    }
  ];

  const handleCreateTerms = () => {
    setIsCreateOpen(true);
  };

  const handleDownloadTemplate = () => {
    // Create a downloadable template
    const templateContent = `TERMS AND CONDITIONS TEMPLATE

1. ACCEPTANCE OF TERMS
By participating in this auction/RFQ, you agree to be bound by these terms and conditions.

2. ELIGIBILITY
Participants must be authorized representatives of their organizations.

3. BIDDING PROCESS
- All bids must be submitted within the specified timeframe
- Bids are binding and cannot be withdrawn
- The lowest compliant bid may be accepted

4. PAYMENT TERMS
Payment terms will be net 30 days from invoice date.

5. DELIVERY REQUIREMENTS
Delivery must be completed within agreed timeframes.

6. LIABILITY
Participants are liable for the accuracy of their submissions.

7. DISPUTE RESOLUTION
Any disputes will be resolved through arbitration.

8. GOVERNING LAW
These terms are governed by applicable local laws.

9. CONTACT INFORMATION
For questions, contact the event organizer.

---
This is a template. Please customize according to your specific requirements.`;

    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'terms-conditions-template.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Terms & conditions template downloaded successfully.",
    });
  };

  const handleUploadDocument = () => {
    // Create a file input dynamically
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "File Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
        // Here you would typically upload to your server
      }
    };
    input.click();
  };

  const handleViewDocument = (doc: any) => {
    setSelectedDoc(doc);
    setIsViewOpen(true);
  };

  const handleUseDocument = (doc: any) => {
    if (!selectedDocuments.find(d => d.name === doc.name)) {
      setSelectedDocuments(prev => [...prev, doc]);
      toast({
        title: "Document Added",
        description: `${doc.name} has been added to your event.`,
      });
    } else {
      toast({
        title: "Document Already Added",
        description: `${doc.name} is already in your event.`,
        variant: "destructive"
      });
    }
  };

  const handleRemoveDocument = (doc: any) => {
    setSelectedDocuments(prev => prev.filter(d => d.name !== doc.name));
    toast({
      title: "Document Removed",
      description: `${doc.name} has been removed from your event.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Terms & Conditions Management
          </CardTitle>
          <CardDescription>
            Configure and manage legal terms and conditions for your event
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={handleCreateTerms}
            >
              <FileText className="h-6 w-6" />
              <span>Create New Terms</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={handleDownloadTemplate}
            >
              <Download className="h-6 w-6" />
              <span>Download Template</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={handleUploadDocument}
            >
              <Upload className="h-6 w-6" />
              <span>Upload Document</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Terms & Conditions</CardTitle>
          <CardDescription>
            Sample documents that can be used for your event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Sample Documents */}
            {sampleDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{doc.type}</Badge>
                      <span className="text-xs text-muted-foreground">{doc.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewDocument(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleDownloadTemplate}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleUseDocument(doc)}
                    disabled={selectedDocuments.find(d => d.name === doc.name)}
                  >
                    {selectedDocuments.find(d => d.name === doc.name) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Added
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Use Document
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Custom Terms */}
            {customTerms.map((doc, index) => (
              <div key={`custom-${index}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors bg-blue-50 border-blue-200">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-blue-100">{doc.type}</Badge>
                      <span className="text-xs text-muted-foreground">{doc.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewDocument(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleDownloadTemplate}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleUseDocument(doc)}
                    disabled={selectedDocuments.find(d => d.name === doc.name)}
                  >
                    {selectedDocuments.find(d => d.name === doc.name) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Added
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Use Document
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Essential Elements:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Payment terms and conditions</li>
                <li>• Delivery and performance requirements</li>
                <li>• Liability and insurance requirements</li>
                <li>• Dispute resolution procedures</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Best Practices:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use clear, simple language</li>
                <li>• Include all necessary legal provisions</li>
                <li>• Review with legal counsel</li>
                <li>• Update regularly for compliance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Documents */}
      {selectedDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Documents for Event</CardTitle>
            <CardDescription>
              Documents that will be included in your event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-success/5 border-success/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveDocument(doc)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Terms Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Terms & Conditions</DialogTitle>
            <DialogDescription>
              Create custom terms and conditions for your event.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Document Title</Label>
              <Input placeholder="Terms & Conditions" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <textarea 
                className="w-full h-96 p-3 border rounded-md resize-none"
                placeholder="Enter your terms and conditions here...

Example content:
1. ACCEPTANCE OF TERMS
By participating in this auction/RFQ, you agree to be bound by these terms and conditions.

2. ELIGIBILITY
Participants must be authorized representatives of their organizations.

3. BIDDING PROCESS
- All bids must be submitted within the specified timeframe
- Bids are binding and cannot be withdrawn
- The lowest compliant bid may be accepted

4. PAYMENT TERMS
Payment terms will be net 30 days from invoice date.

5. DELIVERY REQUIREMENTS
Delivery must be completed within agreed timeframes.

Add your specific terms here..."
                defaultValue=""
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                const newTerm = {
                  name: (document.querySelector('input[placeholder="Terms & Conditions"]') as HTMLInputElement)?.value || "Custom Terms",
                  description: "Custom terms and conditions",
                  size: "1.2 MB",
                  type: "Custom"
                };
                setCustomTerms(prev => [...prev, newTerm]);
                toast({
                  title: "Terms Created",
                  description: "Your custom terms & conditions have been created and added to available documents.",
                });
                setIsCreateOpen(false);
              }}>
                Save Terms
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedDoc?.name}</DialogTitle>
            <DialogDescription>
              {selectedDoc?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg h-96 overflow-auto p-6">
            <div className="text-sm space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold">Document Preview: {selectedDoc?.name}</h3>
                <p className="text-muted-foreground">{selectedDoc?.description}</p>
                <p className="text-xs text-muted-foreground">Size: {selectedDoc?.size}</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Sample Content:</h4>
                <div className="bg-muted/50 p-4 rounded-md">
                  <p className="font-medium">TERMS AND CONDITIONS</p>
                  <br />
                  <p><strong>1. ACCEPTANCE OF TERMS</strong></p>
                  <p>By participating in this auction/RFQ, you agree to be bound by these terms and conditions.</p>
                  <br />
                  <p><strong>2. ELIGIBILITY</strong></p>
                  <p>Participants must be authorized representatives of their organizations.</p>
                  <br />
                  <p><strong>3. BIDDING PROCESS</strong></p>
                  <p>- All bids must be submitted within the specified timeframe</p>
                  <p>- Bids are binding and cannot be withdrawn</p>
                  <p>- The lowest compliant bid may be accepted</p>
                  <br />
                  <p><strong>4. PAYMENT TERMS</strong></p>
                  <p>Payment terms will be net 30 days from invoice date.</p>
                  <br />
                  <p className="text-muted-foreground">...and more standard terms</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};