import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Upload, Copy } from "lucide-react";

interface TermsConditionsProps {
  includeQuestionnaire: boolean;
}

export const TermsConditions = ({ includeQuestionnaire }: TermsConditionsProps) => {
  if (!includeQuestionnaire) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Terms & Conditions</h3>
        <p className="text-muted-foreground">
          Enable "Questionnaire" in step 1 to configure terms and conditions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              New Questionnaire
            </CardTitle>
            <CardDescription>
              Create from scratch or download spreadsheet template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              New Questionnaire
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Questionnaire
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5" />
              Questionnaire Template
            </CardTitle>
            <CardDescription>
              Use existing template as starting point
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Use Template
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Available templates:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Standard RFQ Questionnaire</li>
                <li>Technical Evaluation Form</li>
                <li>Supplier Pre-Qualification</li>
                <li>Service Provider Assessment</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Questionnaire Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Best Practices:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Keep questions clear and specific</li>
                <li>• Use a mix of question types</li>
                <li>• Include scoring criteria</li>
                <li>• Set realistic deadlines</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Question Types:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Multiple choice</li>
                <li>• Text responses</li>
                <li>• File uploads</li>
                <li>• Rating scales</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};