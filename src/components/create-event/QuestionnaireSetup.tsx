import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Questionnaire {
  id?: string;
  name: string;
  deadline?: Date;
  pre_qualification: boolean;
  scoring: boolean;
  weighting: boolean;
  order_index: number;
}

interface QuestionnaireSetupProps {
  includeQuestionnaire: boolean;
  questionnaires: Questionnaire[];
  setQuestionnaires: (questionnaires: Questionnaire[]) => void;
}

export const QuestionnaireSetup = ({ 
  includeQuestionnaire, 
  questionnaires, 
  setQuestionnaires 
}: QuestionnaireSetupProps) => {
  const [showAddAnother, setShowAddAnother] = useState(false);

  if (!includeQuestionnaire) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Questionnaire Setup</h3>
        <p className="text-muted-foreground">
          Enable "Questionnaire" in step 1 to configure questionnaire settings.
        </p>
      </div>
    );
  }

  const addQuestionnaire = () => {
    const newQuestionnaire: Questionnaire = {
      name: "",
      pre_qualification: false,
      scoring: false,
      weighting: false,
      order_index: questionnaires.length + 1
    };
    setQuestionnaires([...questionnaires, newQuestionnaire]);
    setShowAddAnother(false);
  };

  const updateQuestionnaire = (index: number, updates: Partial<Questionnaire>) => {
    const updated = questionnaires.map((q, i) => 
      i === index ? { ...q, ...updates } : q
    );
    setQuestionnaires(updated);
  };

  const removeQuestionnaire = (index: number) => {
    const filtered = questionnaires.filter((_, i) => i !== index);
    setQuestionnaires(filtered);
  };

  // Initialize with one questionnaire if none exist
  if (questionnaires.length === 0) {
    addQuestionnaire();
    return null;
  }

  return (
    <div className="space-y-6">
      {questionnaires.map((questionnaire, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Questionnaire #{index + 1}</CardTitle>
              <CardDescription>Configure questionnaire settings</CardDescription>
            </div>
            {questionnaires.length > 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeQuestionnaire(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`questionnaire-name-${index}`}>What do you want to call it?</Label>
              <Input
                id={`questionnaire-name-${index}`}
                placeholder="RFI, RFP, RFQ, PQQ, Supplier Self certification, Survey"
                value={questionnaire.name}
                onChange={(e) => updateQuestionnaire(index, { name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Deadline (GMT)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !questionnaire.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {questionnaire.deadline ? (
                      format(questionnaire.deadline, "PPP 'at' p")
                    ) : (
                      <span>Set deadline</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={questionnaire.deadline}
                    onSelect={(date) => updateQuestionnaire(index, { deadline: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <Label>Question Configuration</Label>
              <div className="space-y-2">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <Label className="text-sm font-medium">Question Text</Label>
                  <Input 
                    placeholder="Please confirm that you have read our terms & conditions"
                    className="mt-1 mb-3"
                  />
                  <Label className="text-sm font-medium">Question Type</Label>
                  <Select defaultValue="yes_no">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes_no">Yes/No</SelectItem>
                      <SelectItem value="pick_one">Pick one from list</SelectItem>
                      <SelectItem value="multiple_choice">Multiple choice</SelectItem>
                      <SelectItem value="one_line_text">One line text</SelectItem>
                      <SelectItem value="paragraph_text">Paragraph Text</SelectItem>
                      <SelectItem value="document_upload">Document Upload</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox id="mandatory" defaultChecked />
                    <Label htmlFor="mandatory" className="text-sm">Mandatory</Label>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Question
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`pre-qualification-${index}`}
                  checked={questionnaire.pre_qualification}
                  onCheckedChange={(checked) => updateQuestionnaire(index, { pre_qualification: checked as boolean })}
                />
                <Label htmlFor={`pre-qualification-${index}`}>Pre-Qualification</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`scoring-${index}`}
                  checked={questionnaire.scoring}
                  onCheckedChange={(checked) => updateQuestionnaire(index, { scoring: checked as boolean })}
                />
                <Label htmlFor={`scoring-${index}`}>Scoring</Label>
              </div>

              <div className="space-y-2">
                <Label>Weighting</Label>
                <Select 
                  value={questionnaire.weighting ? "yes" : "no"} 
                  onValueChange={(value) => updateQuestionnaire(index, { weighting: value === "yes" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {!showAddAnother && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Would you like another Questionnaire?</p>
            <Button onClick={() => setShowAddAnother(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Questionnaire
            </Button>
          </CardContent>
        </Card>
      )}

      {showAddAnother && (
        <Card className="border-primary">
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-sm">Add another questionnaire to your event?</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={addQuestionnaire}>
                <Plus className="h-4 w-4 mr-2" />
                Yes, Add Another
              </Button>
              <Button variant="outline" onClick={() => setShowAddAnother(false)}>
                No, Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};