import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface QualificationBidsProps {
  event: {
    id: string;
    lots: Array<{
      id: number;
      name: string;
      quantity: string;
      yourPrice?: string;
      totalValue?: string;
      bidStatus: string;
    }>;
  };
  onComplete: () => void;
}

export function QualificationBids({ event, onComplete }: QualificationBidsProps) {
  const [bidPrice, setBidPrice] = useState("250.00");
  const [showError, setShowError] = useState(false);
  const [isBidPlaced, setIsBidPlaced] = useState(false);

  const handleSubmitBid = () => {
    const price = parseFloat(bidPrice);
    if (price < 175 || price > 248.75) {
      setShowError(true);
    } else {
      setShowError(false);
      setIsBidPlaced(true);
      // Auto-proceed to auction after successful bid
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  const handleCancelBid = () => {
    setBidPrice("");
    setShowError(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-7 gap-4 text-sm font-medium text-muted-foreground mb-4">
        <div>LOT #</div>
        <div>LOT NAME</div>
        <div>QUANTITY & UNIT OF MEASURE (UOM)</div>
        <div>YOUR PRICE PER UOM</div>
        <div>TOTAL LOT VALUE PLACED</div>
        <div>BID STATUS</div>
        <div></div>
      </div>

      {event.lots.map((lot) => (
        <Card key={lot.id}>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-4 items-center">
              <div className="font-medium">{lot.id}</div>
              <div>{lot.name}</div>
              <div>{lot.quantity}</div>
              <div className="relative">
                {isBidPlaced ? (
                  <div className="flex items-center gap-2">
                    <span>£{bidPrice}</span>
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-sm">£</span>
                    <Input
                      value={bidPrice}
                      onChange={(e) => setBidPrice(e.target.value)}
                      className="w-20"
                      placeholder="250.00"
                    />
                  </div>
                )}
              </div>
              <div>
                {isBidPlaced ? (
                  `£${(parseFloat(bidPrice) * 20).toFixed(2)}`
                ) : (
                  lot.totalValue || "n/a"
                )}
              </div>
              <div>
                {isBidPlaced ? (
                  <Badge className="bg-green-100 text-green-800">
                    <Check className="w-3 h-3 mr-1" />
                    Place Bid
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800">
                    {lot.bidStatus}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {!isBidPlaced && (
                  <>
                    <Button size="sm" onClick={handleSubmitBid}>
                      <Check className="w-3 h-3 mr-1" />
                      Submit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleCancelBid}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>

            {showError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-red-700 text-sm">
                  <X className="w-4 h-4" />
                  Your bid does not meet the qualification price. Please amend your offer by approximately 30% and re-submit.
                </div>
              </div>
            )}

            <div className="grid grid-cols-7 gap-4 mt-4 pt-4 border-t">
              <div className="col-span-3 font-medium">Total</div>
              <div>n/a</div>
              <div>
                {isBidPlaced ? 
                  `£${(parseFloat(bidPrice) * 20).toFixed(2)}` : 
                  "n/a"
                }
              </div>
              <div></div>
              <div></div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" className="mt-6">
        Turn Down Event
      </Button>
    </div>
  );
}