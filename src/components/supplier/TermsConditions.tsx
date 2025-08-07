import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface TermsConditionsProps {
  event: {
    id: string;
    title: string;
  };
  onComplete: () => void;
}

export function TermsConditions({ event, onComplete }: TermsConditionsProps) {
  const [acceptance, setAcceptance] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (acceptance === "yes") {
      setIsSubmitted(true);
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">Terms and Conditions</span>
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            Not Submitted
          </Badge>
        </div>
        <Button variant="outline" className="text-blue-600">
          Download
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
              1. Terms and Conditions
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="font-medium mb-2">
              1.1) Please confirm your acceptance of our Terms and Conditions
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              Our terms are available in the Documents tab.
            </div>

            <RadioGroup value={acceptance} onValueChange={setAcceptance}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-4 pt-6">
            <Button variant="outline">
              Save progress
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!acceptance}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit answers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}