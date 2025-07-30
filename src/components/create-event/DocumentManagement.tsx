import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, FileText, Trash2, Eye, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Document {
  id?: string;
  name: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  version: string;
  shared_with_all: boolean;
}

interface DocumentManagementProps {
  documents: Document[];
  setDocuments: (documents: Document[]) => void;
  eventId?: string;
}

export const DocumentManagement = ({ 
  documents, 
  setDocuments,
  eventId 
}: DocumentManagementProps) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);

  const handleFileUpload = () => {
    if (!uploadFiles || uploadFiles.length === 0) return;

    const newDocuments: Document[] = Array.from(uploadFiles).map(file => ({
      name: file.name,
      file_size: file.size,
      mime_type: file.type,
      version: "1.0",
      shared_with_all: true
    }));

    setDocuments([...documents, ...newDocuments]);
    setUploadFiles(null);
    setIsUploadOpen(false);
  };

  const removeDocument = (index: number) => {
    const filtered = documents.filter((_, i) => i !== index);
    setDocuments(filtered);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Management
          </CardTitle>
          <CardDescription>
            Upload and manage documents for your event. By default documents are shared with everyone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document(s)
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Documents</DialogTitle>
                  <DialogDescription>
                    Select one or more documents to upload to your event.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add Document from Library</Label>
                    <Select onValueChange={(value) => {
                      const docTemplates = {
                        'terms': { name: 'Standard Terms & Conditions.pdf', version: '1.0', shared_with_all: true },
                        'nda': { name: 'Non-Disclosure Agreement.pdf', version: '1.0', shared_with_all: true },
                        'specifications': { name: 'Technical Specifications Template.docx', version: '1.0', shared_with_all: true }
                      };
                      const template = docTemplates[value as keyof typeof docTemplates];
                      if (template) {
                        setDocuments([...documents, template]);
                        setIsUploadOpen(false);
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select from library" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="terms">Standard Terms & Conditions</SelectItem>
                        <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                        <SelectItem value="specifications">Technical Specifications Template</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Or upload new files</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={(e) => setUploadFiles(e.target.files)}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleFileUpload} disabled={!uploadFiles}>
                      Upload Document(s)
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Select onValueChange={(value) => {
              const docTemplates = {
                'terms': { name: 'Terms & Conditions Template.pdf', version: '1.0', shared_with_all: true },
                'purchase': { name: 'Standard Terms of Purchase.pdf', version: '1.0', shared_with_all: true },
                'specifications': { name: 'Product Specifications Template.docx', version: '1.0', shared_with_all: true }
              };
              const template = docTemplates[value as keyof typeof docTemplates];
              if (template) {
                setDocuments([...documents, template]);
              }
            }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Add from Library" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="terms">Terms & Conditions Template</SelectItem>
                <SelectItem value="purchase">Standard Terms of Purchase</SelectItem>
                <SelectItem value="specifications">Product Specifications</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Uploaded Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">v{doc.version}</Badge>
                            {doc.file_size && <span>{formatFileSize(doc.file_size)}</span>}
                            {doc.shared_with_all && <Badge variant="secondary">Shared with all</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          // Simple document view functionality
                          alert(`Viewing document: ${doc.name}\nSize: ${formatFileSize(doc.file_size || 0)}\nVersion: ${doc.version}`);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          // Simple download functionality
                          alert(`Download would start for: ${doc.name}`);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {documents.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
              <p className="text-sm text-muted-foreground">Upload documents to share with participants</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};