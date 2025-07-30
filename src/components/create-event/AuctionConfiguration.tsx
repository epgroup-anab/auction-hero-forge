import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AuctionSettings {
  start_date?: Date;
  start_time: string;
  bid_direction: string;
  event_type: string;
  minimum_duration: number;
  dynamic_close_period: string;
  minimum_bid_change: number;
  maximum_bid_change: number;
  tied_bid_option: string;
}

interface AuctionConfigurationProps {
  includeAuction: boolean;
  auctionSettings: AuctionSettings;
  setAuctionSettings: (settings: AuctionSettings) => void;
}

export const AuctionConfiguration = ({ 
  includeAuction, 
  auctionSettings, 
  setAuctionSettings 
}: AuctionConfigurationProps) => {
  if (!includeAuction) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Auction Configuration</h3>
        <p className="text-muted-foreground">
          Enable "Online Auction" in the previous step to configure auction settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Auction Settings</CardTitle>
          <CardDescription>Configure your online auction parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Auction Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !auctionSettings.start_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {auctionSettings.start_date ? (
                      format(auctionSettings.start_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={auctionSettings.start_date}
                    onSelect={(date) => setAuctionSettings({...auctionSettings, start_date: date})}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time (GMT)</Label>
              <Input
                id="startTime"
                type="time"
                value={auctionSettings.start_time}
                onChange={(e) => setAuctionSettings({...auctionSettings, start_time: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bid Direction</Label>
              <Select 
                value={auctionSettings.bid_direction} 
                onValueChange={(value) => setAuctionSettings({...auctionSettings, bid_direction: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reverse">Reverse</SelectItem>
                  <SelectItem value="forward">Forward</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select 
                value={auctionSettings.event_type} 
                onValueChange={(value) => setAuctionSettings({...auctionSettings, event_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ranked">Ranked</SelectItem>
                  <SelectItem value="sealed">Sealed</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Minimum Duration (minutes)</Label>
              <Select 
                value={auctionSettings.minimum_duration.toString()} 
                onValueChange={(value) => setAuctionSettings({...auctionSettings, minimum_duration: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Dynamic Close Period</Label>
              <Select 
                value={auctionSettings.dynamic_close_period} 
                onValueChange={(value) => setAuctionSettings({...auctionSettings, dynamic_close_period: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="2_minutes">2 minutes</SelectItem>
                  <SelectItem value="5_minutes">5 minutes</SelectItem>
                  <SelectItem value="10_minutes">10 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBidChange">Minimum Bid Change (%)</Label>
              <Input
                id="minBidChange"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={auctionSettings.minimum_bid_change}
                onChange={(e) => setAuctionSettings({...auctionSettings, minimum_bid_change: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxBidChange">Maximum Bid Change (%)</Label>
              <Input
                id="maxBidChange"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={auctionSettings.maximum_bid_change}
                onChange={(e) => setAuctionSettings({...auctionSettings, maximum_bid_change: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tied Bid Options</Label>
            <Select 
              value={auctionSettings.tied_bid_option} 
              onValueChange={(value) => setAuctionSettings({...auctionSettings, tied_bid_option: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal_worst_position">Equal worst position</SelectItem>
                <SelectItem value="equal_best_position">Equal best position</SelectItem>
                <SelectItem value="first_wins">First submission wins</SelectItem>
                <SelectItem value="last_wins">Last submission wins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};