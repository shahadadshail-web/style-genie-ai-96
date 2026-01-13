import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share2, Download, Loader2, Check, Copy, Sun, Cloud, CloudRain, Snowflake } from "lucide-react";
import { SmartShareCard } from "./SmartShareCard";
import { ClothingItem } from "@/hooks/useClothes";
import { useToast } from "@/hooks/use-toast";

interface ClothingPosition {
  y: number;
  scale: number;
}

interface ShareOutfitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItems: {
    upper: ClothingItem | null;
    lower: ClothingItem | null;
    shoes: ClothingItem | null;
  };
  positions: {
    upper: ClothingPosition;
    lower: ClothingPosition;
    shoes: ClothingPosition;
  };
}

export const ShareOutfitDialog = ({
  open,
  onOpenChange,
  selectedItems,
  positions,
}: ShareOutfitDialogProps) => {
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("Today's Look");
  const [stylingTip, setStylingTip] = useState("");
  const [weatherIcon, setWeatherIcon] = useState<"sun" | "cloud" | "rain" | "snow">("sun");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      // Wait a moment for images to load
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      
      setGeneratedImage(dataUrl);
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate the outfit card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!generatedImage) {
      await handleGenerateImage();
      return;
    }

    try {
      // Convert data URL to blob
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File([blob], `outfit-${Date.now()}.png`, { type: "image/png" });

      // Check if Web Share API is available with files support
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: title,
          text: `Check out my outfit: ${title}`,
          files: [file],
        });
        toast({
          title: "Shared Successfully!",
          description: "Your outfit has been shared.",
        });
      } else if (navigator.share) {
        // Fallback to sharing without files
        await navigator.share({
          title: title,
          text: `Check out my outfit: ${title}`,
        });
      } else {
        // Fallback for browsers without Web Share API
        handleDownload();
        toast({
          title: "Downloaded!",
          description: "Sharing not supported. Image downloaded instead.",
        });
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Share failed:", error);
        toast({
          title: "Share Failed",
          description: "Could not share the outfit. Try downloading instead.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.download = `outfit-${title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.png`;
    link.href = generatedImage;
    link.click();
    
    toast({
      title: "Downloaded!",
      description: "Your outfit card has been saved to your device.",
    });
  };

  const handleCopyToClipboard = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      toast({
        title: "Copied!",
        description: "Image copied to clipboard.",
      });
    } catch (error) {
      console.error("Copy failed:", error);
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setGeneratedImage(null);
    setTitle("Today's Look");
    setStylingTip("");
    setWeatherIcon("sun");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-500" />
            Share Your Outfit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="outfit-title">Card Title</Label>
            <Input
              id="outfit-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setGeneratedImage(null);
              }}
              placeholder="e.g., Today's Look, Weekend Vibes"
              className="bg-background"
            />
          </div>

          {/* Styling Tip */}
          <div className="space-y-2">
            <Label htmlFor="styling-tip">AI Styling Tip</Label>
            <Input
              id="styling-tip"
              value={stylingTip}
              onChange={(e) => {
                setStylingTip(e.target.value);
                setGeneratedImage(null);
              }}
              placeholder="e.g., Light blue vibes for a sunny day"
              className="bg-background"
            />
          </div>

          {/* Weather Icon */}
          <div className="space-y-2">
            <Label>Weather</Label>
            <Select value={weatherIcon} onValueChange={(v) => { setWeatherIcon(v as any); setGeneratedImage(null); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sun"><span className="flex items-center gap-2"><Sun className="w-4 h-4 text-yellow-500" /> Sunny</span></SelectItem>
                <SelectItem value="cloud"><span className="flex items-center gap-2"><Cloud className="w-4 h-4 text-gray-500" /> Cloudy</span></SelectItem>
                <SelectItem value="rain"><span className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-blue-500" /> Rainy</span></SelectItem>
                <SelectItem value="snow"><span className="flex items-center gap-2"><Snowflake className="w-4 h-4 text-cyan-400" /> Snowy</span></SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hidden Card for Rendering */}
          <div className="absolute -left-[9999px] -top-[9999px]">
            <SmartShareCard
              ref={cardRef}
              title={title}
              stylingTip={stylingTip}
              weatherIcon={weatherIcon}
              selectedItems={selectedItems}
              positions={positions}
            />
          </div>

          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
              <div className="flex items-center gap-2 text-purple-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </div>
            </div>
          )}

          {/* Generated Image Preview */}
          {generatedImage && (
            <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-sm text-green-400">
              <Check className="w-4 h-4" />
              <span>Image ready to share!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {!generatedImage ? (
              <Button
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="w-full gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Card...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Generate Outfit Card
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleShare}
                  className="w-full gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                >
                  <Share2 className="w-4 h-4" />
                  Share Outfit
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCopyToClipboard}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
