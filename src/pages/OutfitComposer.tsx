import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Share2, Trash2 } from "lucide-react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { MannequinSilhouette } from "@/components/composer/MannequinSilhouette";
import { ClothingOverlay } from "@/components/composer/ClothingOverlay";
import { WardrobePanel } from "@/components/composer/WardrobePanel";
import { ShareOutfitDialog } from "@/components/composer/ShareOutfitDialog";
import { ClothingItem } from "@/hooks/useClothes";
import { useSaveOutfit } from "@/hooks/useSavedOutfits";
import { useToast } from "@/hooks/use-toast";

interface ClothingPosition {
  y: number;
  scale: number;
}

const OutfitComposer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const saveOutfitMutation = useSaveOutfit();
  const composerRef = useRef<HTMLDivElement>(null);

  const [selectedItems, setSelectedItems] = useState<{
    upper: ClothingItem | null;
    lower: ClothingItem | null;
    shoes: ClothingItem | null;
  }>({
    upper: null,
    lower: null,
    shoes: null,
  });

  const [positions, setPositions] = useState<{
    upper: ClothingPosition;
    lower: ClothingPosition;
    shoes: ClothingPosition;
  }>({
    upper: { y: 0, scale: 1 },
    lower: { y: 0, scale: 1 },
    shoes: { y: 0, scale: 1 },
  });

  const [activeZone, setActiveZone] = useState<"upper" | "lower" | "shoes" | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleSelectItem = (item: ClothingItem) => {
    const zone = 
      item.category === "Upper Body" ? "upper" :
      item.category === "Lower Body" ? "lower" :
      item.category === "Shoes" ? "shoes" : null;
    
    if (zone) {
      setSelectedItems(prev => ({ ...prev, [zone]: item }));
      setActiveZone(zone);
    }
  };

  const handleClearItem = (zone: "upper" | "lower" | "shoes") => {
    setSelectedItems(prev => ({ ...prev, [zone]: null }));
    setPositions(prev => ({ ...prev, [zone]: { y: 0, scale: 1 } }));
    if (activeZone === zone) setActiveZone(null);
  };

  const handlePositionChange = (zone: "upper" | "lower" | "shoes", position: ClothingPosition) => {
    setPositions(prev => ({ ...prev, [zone]: position }));
  };

  const handleExportLook = async () => {
    if (!composerRef.current) return;
    if (!selectedItems.upper || !selectedItems.lower || !selectedItems.shoes) {
      toast({
        title: "Incomplete Outfit",
        description: "Please select items for all three zones before capturing.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      // Capture the mannequin area as an image
      await toPng(composerRef.current, {
        quality: 0.95,
        backgroundColor: "#1a1a2e",
      });

      // Save the outfit to the database
      await saveOutfitMutation.mutateAsync({
        upperBodyId: selectedItems.upper.id,
        lowerBodyId: selectedItems.lower.id,
        shoesId: selectedItems.shoes.id,
        styleNotes: "Created with Visual Composer",
      });

      toast({
        title: "Look Saved!",
        description: "Your outfit has been captured and saved to My Looks.",
      });

      navigate("/my-looks");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to capture look. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const hasAnyItem = selectedItems.upper || selectedItems.lower || selectedItems.shoes;
  const hasCompleteOutfit = selectedItems.upper && selectedItems.lower && selectedItems.shoes;

  const handleOpenShareDialog = () => {
    if (!hasCompleteOutfit) {
      toast({
        title: "Incomplete Outfit",
        description: "Please select items for all three zones before sharing.",
        variant: "destructive",
      });
      return;
    }
    setIsShareDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-semibold">
                  Outfit Composer
                </h1>
                <p className="text-sm text-muted-foreground">
                  Drag & drop to create your perfect look
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Share Button */}
              <Button
                variant="outline"
                onClick={handleOpenShareDialog}
                disabled={!hasCompleteOutfit}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              
              {/* Capture Look Button */}
              <Button
                onClick={handleExportLook}
                disabled={!hasCompleteOutfit || isExporting}
                className="gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span className="hidden sm:inline">Capture Look</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Share Dialog */}
      <ShareOutfitDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        selectedItems={selectedItems}
        positions={positions}
      />

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_350px] gap-6 h-[calc(100vh-180px)]">
          {/* Mannequin Display Area */}
          <div className="relative flex items-center justify-center bg-gradient-to-b from-slate-900/50 to-slate-950/80 rounded-3xl border border-purple-500/20 overflow-hidden">
            {/* Ambient Glow Background */}
            <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent" />
            
            {/* Composer Area */}
            <div 
              ref={composerRef}
              className="relative w-full max-w-[300px] h-[550px] mx-auto"
              onClick={() => setActiveZone(null)}
            >
              {/* Mannequin Silhouette */}
              <MannequinSilhouette className="absolute inset-0 opacity-60" />
              
              {/* Clothing Overlays */}
              {selectedItems.upper && (
                <ClothingOverlay
                  imageUrl={selectedItems.upper.image_url}
                  zone="upper"
                  isSelected={activeZone === "upper"}
                  onSelect={() => setActiveZone("upper")}
                  position={positions.upper}
                  onPositionChange={(pos) => handlePositionChange("upper", pos)}
                />
              )}
              
              {selectedItems.lower && (
                <ClothingOverlay
                  imageUrl={selectedItems.lower.image_url}
                  zone="lower"
                  isSelected={activeZone === "lower"}
                  onSelect={() => setActiveZone("lower")}
                  position={positions.lower}
                  onPositionChange={(pos) => handlePositionChange("lower", pos)}
                />
              )}
              
              {selectedItems.shoes && (
                <ClothingOverlay
                  imageUrl={selectedItems.shoes.image_url}
                  zone="shoes"
                  isSelected={activeZone === "shoes"}
                  onSelect={() => setActiveZone("shoes")}
                  position={positions.shoes}
                  onPositionChange={(pos) => handlePositionChange("shoes", pos)}
                />
              )}
              
              {/* Zone Indicators when empty */}
              {!selectedItems.upper && (
                <div className="absolute left-1/2 -translate-x-1/2 top-[15%] text-purple-400/50 text-xs text-center">
                  <div className="border border-dashed border-purple-400/30 rounded-lg px-4 py-6">
                    Upper Body
                  </div>
                </div>
              )}
              {!selectedItems.lower && (
                <div className="absolute left-1/2 -translate-x-1/2 top-[48%] text-purple-400/50 text-xs text-center">
                  <div className="border border-dashed border-purple-400/30 rounded-lg px-4 py-6">
                    Lower Body
                  </div>
                </div>
              )}
              {!selectedItems.shoes && (
                <div className="absolute left-1/2 -translate-x-1/2 top-[88%] text-purple-400/50 text-xs text-center">
                  <div className="border border-dashed border-purple-400/30 rounded-lg px-3 py-2">
                    Shoes
                  </div>
                </div>
              )}
            </div>

            {/* Clear buttons */}
            {hasAnyItem && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {selectedItems.upper && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleClearItem("upper")}
                    className="text-xs bg-card/80"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Top
                  </Button>
                )}
                {selectedItems.lower && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleClearItem("lower")}
                    className="text-xs bg-card/80"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Bottom
                  </Button>
                )}
                {selectedItems.shoes && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleClearItem("shoes")}
                    className="text-xs bg-card/80"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Shoes
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Wardrobe Panel */}
          <div className="h-full">
            <WardrobePanel
              onSelectItem={handleSelectItem}
              selectedItems={selectedItems}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OutfitComposer;
