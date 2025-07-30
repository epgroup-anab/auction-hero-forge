import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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

interface EventBasicSetupProps {
  eventData: EventData;
  setEventData: (data: EventData) => void;
}

export const EventBasicSetup = ({ eventData, setEventData }: EventBasicSetupProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eventName">Event Name *</Label>
          <Input
            id="eventName"
            placeholder="e.g., IT Hardware"
            value={eventData.name}
            onChange={(e) => setEventData({...eventData, name: e.target.value})}
            className="text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Event Category</Label>
            <div className="flex gap-2">
              <Select value={eventData.category} onValueChange={(value) => setEventData({...eventData, category: value})}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Government Procurement</SelectItem>
                  <SelectItem value="corporate">Corporate Sourcing</SelectItem>
                  <SelectItem value="services">Professional Services</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="it">IT & Technology</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                Categorise your event
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select value={eventData.default_currency} onValueChange={(value) => setEventData({...eventData, default_currency: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                <SelectItem value="ARS">ARS - Argentine Peso</SelectItem>
                <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="multiCurrency" 
              checked={eventData.multi_currency}
              onCheckedChange={(checked) => setEventData({...eventData, multi_currency: checked as boolean})}
            />
            <Label htmlFor="multiCurrency">Multi Currency event</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brief">Brief</Label>
          <div className="border rounded-md">
            {/* Rich text editor toolbar */}
            <div className="border-b p-2 flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <strong>B</strong>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <em>I</em>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="line-through">S</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <u>U</u>
              </Button>
              <div className="w-px bg-border mx-1" />
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                •
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                1.
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                "
              </Button>
            </div>
            <Textarea
              id="brief"
              placeholder="We are looking to source 20 laptops. These must be delivered to our London office. Please see product specification available in the Documents tab for more details."
              value={eventData.brief_text}
              onChange={(e) => setEventData({...eventData, brief_text: e.target.value})}
              className="min-h-[120px] resize-none border-0 focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sealResults" 
              checked={eventData.sealResults}
              onCheckedChange={(checked) => setEventData({...eventData, sealResults: checked as boolean})}
            />
            <Label htmlFor="sealResults">Seal results until after deadline</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Event Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer transition-all hover:shadow-md" 
                onClick={() => setEventData({...eventData, includeQuestionnaire: !eventData.includeQuestionnaire})}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Checkbox checked={eventData.includeQuestionnaire} className="mt-1" />
                <div>
                  <h4 className="font-medium">Would you like a Questionnaire?</h4>
                  <p className="text-sm text-muted-foreground">Collect qualitative responses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-md" 
                onClick={() => setEventData({...eventData, includeRFQ: !eventData.includeRFQ})}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Checkbox checked={eventData.includeRFQ} className="mt-1" />
                <div>
                  <h4 className="font-medium">Do you want to have an RFQ?</h4>
                  <p className="text-sm text-muted-foreground">Request detailed quotes from suppliers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => setEventData({...eventData, includeAuction: !eventData.includeAuction})}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Checkbox checked={eventData.includeAuction} className="mt-1" />
                <div>
                  <h4 className="font-medium">Do you want to have an Online Auction?</h4>
                  <p className="text-sm text-muted-foreground">Real-time competitive bidding</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};