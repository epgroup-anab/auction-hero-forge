import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Upload, Eye, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TermsConditionsContent = () => {
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
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Create New Terms</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Download className="h-6 w-6" />
              <span>Download Template</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
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
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm">
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
    </div>
  );
};