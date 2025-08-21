import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Check, X } from "lucide-react";

interface AwardLotsDialogProps {
  lots: Array<{
    id: number;
    name: string;
    bestBidValue: string;
    leadParticipant: string;
    savingsOffered: string;
  }>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AwardLotsDialog({ lots, isOpen, onOpenChange }: AwardLotsDialogProps) {
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
  const [ccEmail, setCcEmail] = useState("");
  const [emailContent, setEmailContent] = useState("Hello,\n\nYou have been awarded the following Lots:\n\nLaptops");
  const [includedLots, setIncludedLots] = useState<{[key: number]: boolean}>({
    1: true
  });

  const handleCreateAwardNotice = () => {
    setShowEmailComposer(true);
  };

  const handleSendAwardNotice = () => {
    // Handle sending award notice
    console.log("Sending award notice...");
    setShowEmailComposer(false);
    onOpenChange(false);
  };

  const calculateTotalSavings = () => {
    const totalLatestBid = 1800.00;
    const totalSavings = 200.00;
    return {
      latestBid: `£${totalLatestBid.toFixed(2)}`,
      savings: `£${totalSavings.toFixed(2)}`,
      percentage: "10.00%"
    };
  };

  const totals = calculateTotalSavings();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Award className="w-4 h-4 mr-2" />
          Award Lots
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Award Lots</DialogTitle>
        </DialogHeader>
        
        {!showEmailComposer ? (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Use this pop-up to record how you intend to award the Lots to your participants. You can also notify them via the tool by choosing who to notify and creating a new award notice to send them. You can do this in stages if you wish to bespoke each notification.
            </p>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>LOT #</TableHead>
                    <TableHead>LOT NAME</TableHead>
                    <TableHead>AWARDED PARTICIPANT</TableHead>
                    <TableHead>LATEST BID VALUE</TableHead>
                    <TableHead>SAVINGS VALUE</TableHead>
                    <TableHead>SAVINGS PERCENTAGE</TableHead>
                    <TableHead>INCLUDE IN AWARD NOTICE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lots.map((lot) => (
                    <TableRow key={lot.id}>
                      <TableCell>{lot.id}</TableCell>
                      <TableCell>{lot.name}</TableCell>
                      <TableCell>{lot.leadParticipant}</TableCell>
                      <TableCell>{lot.bestBidValue}</TableCell>
                      <TableCell>£200.00</TableCell>
                      <TableCell>10.00%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={includedLots[lot.id] ? "default" : "outline"}
                            className={includedLots[lot.id] ? "bg-green-600 hover:bg-green-700" : ""}
                            onClick={() => setIncludedLots(prev => ({ ...prev, [lot.id]: !prev[lot.id] }))}
                          >
                            {includedLots[lot.id] ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell className="font-bold">Totals</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="font-bold">{totals.latestBid}</TableCell>
                    <TableCell className="font-bold">{totals.savings}</TableCell>
                    <TableCell className="font-bold">{totals.percentage}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between">
              <Button 
                onClick={handleCreateAwardNotice}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create New Award Notice
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Include a Purchase Order Number (optional)</label>
                <Input
                  value={purchaseOrderNumber}
                  onChange={(e) => setPurchaseOrderNumber(e.target.value)}
                  placeholder="Enter PO number"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">CC:</label>
                <Input
                  value={ccEmail}
                  onChange={(e) => setCcEmail(e.target.value)}
                  placeholder="Enter CC email address"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Edit the email that accompanies the Award Notice</label>
                <div className="mt-2 border border-gray-300 rounded-md">
                  <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
                    <Button size="sm" variant="outline">B</Button>
                    <Button size="sm" variant="outline">I</Button>
                    <Button size="sm" variant="outline">S</Button>
                    <Button size="sm" variant="outline">U</Button>
                    <div className="border-l border-gray-300 h-4 mx-2"></div>
                    <select className="text-sm border-0 bg-transparent">
                      <option>Normal</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <Textarea
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      className="min-h-[200px] resize-none border-0"
                      placeholder="Enter email content"
                    />
                    <div className="bg-gray-50 p-4 rounded border">
                      <div className="text-sm">
                        <div className="mb-4">
                          <strong>Hello,</strong>
                        </div>
                        <div className="mb-4">
                          You have been awarded the following Lots:
                        </div>
                        <div>
                          <strong>Laptops</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowEmailComposer(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendAwardNotice}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Send Award Notice
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}