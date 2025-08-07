import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

interface EventDocumentsProps {
  event: {
    id: string;
    title: string;
  };
}

export function EventDocuments({ event }: EventDocumentsProps) {
  const documents = [
    {
      id: 1,
      name: "Terms and Conditions.pdf",
      type: "PDF Document",
      size: "2.3 MB",
      uploadedDate: "January 15, 2020"
    },
    {
      id: 2,
      name: "Product Specification.pdf",
      type: "PDF Document", 
      size: "1.8 MB",
      uploadedDate: "January 15, 2020"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-6">
            All documents related to this event are listed below. Click the download button to access each document.
          </div>

          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-red-600" />
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {doc.type} • {doc.size} • Uploaded {doc.uploadedDate}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}