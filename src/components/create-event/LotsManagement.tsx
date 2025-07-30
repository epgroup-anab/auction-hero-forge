import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Package, Upload, Library, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lot {
  id?: string;
  name: string;
  quantity: number;
  unit_of_measure: string;
  current_price?: number;
  qualification_price?: number;
  current_value?: number;
  qualification_value?: number;
}

interface LotsManagementProps {
  includeRFQ: boolean;
  lots: Lot[];
  setLots: (lots: Lot[]) => void;
  currency: string;
}

export const LotsManagement = ({ 
  includeRFQ, 
  lots, 
  setLots,
  currency 
}: LotsManagementProps) => {
  const [isAddLotOpen, setIsAddLotOpen] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [newLot, setNewLot] = useState<Lot>({
    name: "",
    quantity: 1,
    unit_of_measure: "",
    current_price: 0,
    qualification_price: 0
  });

  if (!includeRFQ) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">RFQ Lots Management</h3>
        <p className="text-muted-foreground">
          Enable "RFQ" in step 1 to configure lots for your request for quote.
        </p>
      </div>
    );
  }

  const handleAddLot = () => {
    const calculatedCurrentValue = (newLot.current_price || 0) * newLot.quantity;
    const calculatedQualValue = (newLot.qualification_price || 0) * newLot.quantity;
    
    const lotToAdd: Lot = {
      ...newLot,
      current_value: calculatedCurrentValue,
      qualification_value: calculatedQualValue
    };
    
    setLots([...lots, lotToAdd]);
    setNewLot({
      name: "",
      quantity: 1,
      unit_of_measure: "",
      current_price: 0,
      qualification_price: 0
    });
    setIsAddLotOpen(false);
  };

  const removeLot = (index: number) => {
    const filtered = lots.filter((_, i) => i !== index);
    setLots(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">RFQ Lots</h3>
          <p className="text-sm text-muted-foreground">
            Configure the lots/items you want quotes for
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isAdvancedMode ? "outline" : "default"}
            size="sm"
            onClick={() => setIsAdvancedMode(false)}
          >
            Simple
          </Button>
          <Button
            variant={isAdvancedMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAdvancedMode(true)}
          >
            Advanced
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={cn("transition-all", !isAdvancedMode && "ring-2 ring-primary")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Simple Lots
            </CardTitle>
            <CardDescription>
              Simple is good for just a price by Lot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dialog open={isAddLotOpen} onOpenChange={setIsAddLotOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  New Lot
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Lot</DialogTitle>
                  <DialogDescription>
                    Create a new lot for your RFQ
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lot-name">Lot Name</Label>
                    <Input
                      id="lot-name"
                      value={newLot.name}
                      onChange={(e) => setNewLot({...newLot, name: e.target.value})}
                      placeholder="e.g., Office Laptops"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity of UoM's</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={newLot.quantity}
                        onChange={(e) => setNewLot({...newLot, quantity: parseInt(e.target.value) || 1})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uom">Unit of Measure (UoM)</Label>
                      <Input
                        id="uom"
                        value={newLot.unit_of_measure}
                        onChange={(e) => setNewLot({...newLot, unit_of_measure: e.target.value})}
                        placeholder="e.g., Each, Kg, m²"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-price">Current Price ({currency})</Label>
                      <Input
                        id="current-price"
                        type="number"
                        step="0.01"
                        value={newLot.current_price || ''}
                        onChange={(e) => setNewLot({...newLot, current_price: parseFloat(e.target.value) || 0})}
                        placeholder="Not shown to participants"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qual-price">Qualification Price ({currency})</Label>
                      <Input
                        id="qual-price"
                        type="number"
                        step="0.01"
                        value={newLot.qualification_price || ''}
                        onChange={(e) => setNewLot({...newLot, qualification_price: parseFloat(e.target.value) || 0})}
                        placeholder="Not shown to participants"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Current Value ({currency})</Label>
                      <div className="p-2 bg-muted rounded">
                        {((newLot.current_price || 0) * newLot.quantity).toFixed(2)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Qual Value ({currency})</Label>
                      <div className="p-2 bg-muted rounded">
                        {((newLot.qualification_price || 0) * newLot.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsAddLotOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddLot} disabled={!newLot.name}>
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Lot Template
            </Button>
          </CardContent>
        </Card>

        <Card className={cn("transition-all", isAdvancedMode && "ring-2 ring-primary")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5" />
              Advanced Options
            </CardTitle>
            <CardDescription>
              Advanced lets you add multiple price or text components as well as build line items inside Lots with bespoke names
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isAdvancedMode ? (
              <>
                <Dialog open={isAddLotOpen} onOpenChange={setIsAddLotOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      New Advanced Lot
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Advanced Lot Configuration</DialogTitle>
                      <DialogDescription>
                        Configure advanced lot with multiple components
                      </DialogDescription>
                    </DialogHeader>
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Advanced lot builder coming soon</p>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="w-full">
                  <Library className="h-4 w-4 mr-2" />
                  Load from Library
                </Button>
              </>
            ) : (
              <>
                <Button className="w-full" disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  New Lot
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <Library className="h-4 w-4 mr-2" />
                  Load from Library
                </Button>
                <Badge variant="secondary" className="w-full justify-center">
                  Select Advanced Mode
                </Badge>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {lots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Created Lots ({lots.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lots.map((lot, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{lot.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      <span>{lot.quantity} {lot.unit_of_measure}</span>
                      {lot.current_value && (
                        <span className="ml-4">Value: {currency} {lot.current_value.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeLot(index)}
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

      {lots.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No lots created yet</p>
          <p className="text-sm text-muted-foreground">Add lots to define what you want quotes for</p>
        </div>
      )}
    </div>
  );
};