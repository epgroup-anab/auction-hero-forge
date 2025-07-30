import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Upload, Eye, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const TermsConditionsContent = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

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
    toast({
      title: "Download Started",
      description: "Template download will begin shortly.",
    });
  };

  const handleUploadDocument = () => {
    toast({
      title: "Upload Feature",
      description: "Document upload functionality coming soon.",
    });
  };

  const handleViewDocument = (doc: any) => {
    setSelectedDoc(doc);
    setIsViewOpen(true);
  };

  const handleUseDocument = (doc: any) => {
    toast({
      title: "Document Selected",
      description: `${doc.name} has been added to your event.`,
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
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Use Document
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

      {/* Create Terms Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Terms & Conditions</DialogTitle>
            <DialogDescription>
              Create custom terms and conditions for your event.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Terms editor coming soon</p>
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
          <div className="border rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Document preview not available</p>
              <p className="text-sm text-muted-foreground">Size: {selectedDoc?.size}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};