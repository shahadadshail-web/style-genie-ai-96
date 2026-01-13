import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useClothes, ClothingItem, ClothingCategory } from "@/hooks/useClothes";
import { useCalendarOutfitByDate, useScheduleOutfit, useDeleteCalendarOutfit } from "@/hooks/useCalendarOutfits";
import { toast } from "sonner";
import { Loader2, Trash2, Cloud, Sun, CloudRain, Snowflake, MapPin } from "lucide-react";
import { MiniOutfitComposition } from "./MiniOutfitComposition";

interface CalendarDayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
}

export const CalendarDayDialog = ({ open, onOpenChange, date }: CalendarDayDialogProps) => {
  const dateStr = format(date, "yyyy-MM-dd");
  const { data: existingOutfit, isLoading: isLoadingOutfit } = useCalendarOutfitByDate(dateStr);
  const scheduleOutfit = useScheduleOutfit();
  const deleteOutfit = useDeleteCalendarOutfit();
  
  const [selectedItems, setSelectedItems] = useState<{
    upper: ClothingItem | null;
    lower: ClothingItem | null;
    shoes: ClothingItem | null;
  }>({
    upper: null,
    lower: null,
    shoes: null,
  });
  
  const [weatherText, setWeatherText] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState<ClothingCategory>("Upper Body");
  
  const { data: upperClothes = [] } = useClothes("Upper Body");
  const { data: lowerClothes = [] } = useClothes("Lower Body");
  const { data: shoesClothes = [] } = useClothes("Shoes");
  
  // Pre-populate with existing outfit data
  useEffect(() => {
    if (existingOutfit) {
      setSelectedItems({
        upper: existingOutfit.upper_body || null,
        lower: existingOutfit.lower_body || null,
        shoes: existingOutfit.shoes || null,
      });
      setWeatherText(existingOutfit.weather_text || "");
      setLocation(existingOutfit.location || "");
      setNotes(existingOutfit.notes || "");
    } else {
      setSelectedItems({ upper: null, lower: null, shoes: null });
      setWeatherText("");
      setLocation("");
      setNotes("");
    }
  }, [existingOutfit, dateStr]);
  
  const handleSelectItem = (item: ClothingItem) => {
    const zone = 
      item.category === "Upper Body" ? "upper" :
      item.category === "Lower Body" ? "lower" :
      item.category === "Shoes" ? "shoes" : null;
    
    if (zone) {
      setSelectedItems(prev => ({ ...prev, [zone]: item }));
    }
  };
  
  const handleSave = async () => {
    if (!selectedItems.upper && !selectedItems.lower && !selectedItems.shoes) {
      toast.error("Please select at least one clothing item");
      return;
    }
    
    try {
      await scheduleOutfit.mutateAsync({
        scheduledDate: dateStr,
        upperBodyId: selectedItems.upper?.id,
        lowerBodyId: selectedItems.lower?.id,
        shoesId: selectedItems.shoes?.id,
        weatherText,
        location,
        notes,
      });
      
      toast.success(`Outfit scheduled for ${format(date, "MMMM d, yyyy")}`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to schedule outfit");
    }
  };
  
  const handleDelete = async () => {
    if (!existingOutfit) return;
    
    try {
      await deleteOutfit.mutateAsync(existingOutfit.id);
      toast.success("Outfit removed from calendar");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to remove outfit");
    }
  };

  const getClothesForTab = () => {
    switch (activeTab) {
      case "Upper Body": return upperClothes;
      case "Lower Body": return lowerClothes;
      case "Shoes": return shoesClothes;
      default: return [];
    }
  };

  const getSelectedForTab = () => {
    switch (activeTab) {
      case "Upper Body": return selectedItems.upper;
      case "Lower Body": return selectedItems.lower;
      case "Shoes": return selectedItems.shoes;
      default: return null;
    }
  };

  const hasAnySelection = selectedItems.upper || selectedItems.lower || selectedItems.shoes;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
            {existingOutfit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleteOutfit.isPending}
                className="text-destructive hover:text-destructive"
              >
                {deleteOutfit.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoadingOutfit ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden grid md:grid-cols-[200px_1fr] gap-4">
            {/* Preview Column */}
            <div className="bg-gradient-to-b from-slate-900/50 to-slate-950/80 rounded-xl p-4 flex flex-col">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Preview</h3>
              <div className="flex-1 min-h-[200px]">
                {hasAnySelection ? (
                  <MiniOutfitComposition
                    outfit={{
                      id: "",
                      user_id: "",
                      scheduled_date: dateStr,
                      upper_body_id: selectedItems.upper?.id || null,
                      lower_body_id: selectedItems.lower?.id || null,
                      shoes_id: selectedItems.shoes?.id || null,
                      weather_text: weatherText,
                      location,
                      notes,
                      created_at: "",
                      updated_at: "",
                      upper_body: selectedItems.upper || undefined,
                      lower_body: selectedItems.lower || undefined,
                      shoes: selectedItems.shoes || undefined,
                    }}
                    size="md"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    Select items →
                  </div>
                )}
              </div>
              
              {/* Weather & Location */}
              <div className="space-y-3 mt-4 pt-4 border-t border-border/50">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1">
                    <Sun className="w-3 h-3" /> Weather
                  </Label>
                  <Input
                    value={weatherText}
                    onChange={(e) => setWeatherText(e.target.value)}
                    placeholder="e.g., Sunny 72°F"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Office, Dinner"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Selection Column */}
            <div className="flex flex-col overflow-hidden">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ClothingCategory)}>
                <TabsList className="w-full grid grid-cols-3 mb-3">
                  <TabsTrigger value="Upper Body" className="text-xs">
                    Tops {selectedItems.upper && "✓"}
                  </TabsTrigger>
                  <TabsTrigger value="Lower Body" className="text-xs">
                    Bottoms {selectedItems.lower && "✓"}
                  </TabsTrigger>
                  <TabsTrigger value="Shoes" className="text-xs">
                    Shoes {selectedItems.shoes && "✓"}
                  </TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1 h-[250px]">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pr-4">
                    {getClothesForTab().map((item) => {
                      const isSelected = getSelectedForTab()?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectItem(item)}
                          className={`
                            aspect-square rounded-lg overflow-hidden border-2 transition-all
                            ${isSelected 
                              ? "border-purple-500 ring-2 ring-purple-500/30" 
                              : "border-border hover:border-accent/50"
                            }
                          `}
                        >
                          <img
                            src={item.image_url}
                            alt={item.sub_category || item.category}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                    {getClothesForTab().length === 0 && (
                      <div className="col-span-full text-center py-8 text-muted-foreground text-sm">
                        No items in this category
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </Tabs>

              {/* Notes */}
              <div className="mt-4 space-y-1.5">
                <Label className="text-xs">Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any styling notes for this day..."
                  className="h-16 text-xs resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={scheduleOutfit.isPending || !hasAnySelection}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
          >
            {scheduleOutfit.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : existingOutfit ? (
              "Update Outfit"
            ) : (
              "Schedule Outfit"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
