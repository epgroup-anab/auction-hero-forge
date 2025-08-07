import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, MessageSquare } from "lucide-react";

interface LiveAuctionProps {
  event: {
    id: string;
    title: string;
    lots: Array<{
      id: number;
      name: string;
      quantity: string;
      yourPrice?: string;
      totalValue?: string;
    }>;
  };
}

export function LiveAuction({ event }: LiveAuctionProps) {
  const [newBid, setNewBid] = useState("221");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentBid, setCurrentBid] = useState("250.00");

  const handlePlaceBid = () => {
    setCurrentBid(newBid + ".00");
    setShowConfirmDialog(false);
    setNewBid("");
  };

  return (
    <div className="space-y-6">
      {/* Live Auction Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Live auction feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            The Live Auction Feed will provide real-time notifications of messages and changes to the auction settings.
          </div>
          <div className="text-sm text-muted-foreground">
            Currently you have no notifications.
          </div>
        </CardContent>
      </Card>

      {/* Auction Table */}
      <div className="space-y-4">
        <div className="grid grid-cols-8 gap-4 text-sm font-medium text-muted-foreground">
          <div>LOT #</div>
          <div>LOT NAME</div>
          <div>QUANTITY & UNIT OF MEASURE (UOM)</div>
          <div>BID RANGE</div>
          <div>YOUR BID PER UOM</div>
          <div>TOTAL LOT VALUE PLACED</div>
          <div>YOUR RANK</div>
          <div>ENTER NEW BID</div>
        </div>

        {event.lots.map((lot) => (
          <Card key={lot.id}>
            <CardContent className="p-4">
              <div className="grid grid-cols-8 gap-4 items-center">
                <div className="font-medium">{lot.id}</div>
                <div>{lot.name}</div>
                <div>{lot.quantity}</div>
                <div>-</div>
                <div>£{currentBid}</div>
                <div>£{(parseFloat(currentBid) * 20).toFixed(2)}</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                    2
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Check className="w-3 h-3 mr-1" />
                        Place Bid
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Please confirm</AlertDialogTitle>
                        <AlertDialogDescription>
                          You have provided the following bid price:
                          <br />
                          <strong>£{newBid}.00</strong>
                          <br />
                          Are you sure?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePlaceBid}>
                          OK
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-8 gap-4 mt-4 pt-4 border-t">
                <div className="col-span-4 font-medium">Total</div>
                <div></div>
                <div>£{(parseFloat(currentBid) * 20).toFixed(2)}</div>
                <div></div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">£</span>
                  <Input
                    value={newBid}
                    onChange={(e) => setNewBid(e.target.value)}
                    className="w-20"
                    placeholder="221"
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-red-700 text-sm">
                  <span className="font-medium">⚠</span>
                  Bid must be between £175.00 and £248.75
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" className="text-blue-600">
          Send New Message
        </Button>
      </div>
    </div>
  );
}