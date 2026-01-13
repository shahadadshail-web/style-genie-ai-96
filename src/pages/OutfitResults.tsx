import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Heart, Sparkles, Loader2, Check } from "lucide-react";
import { useOutfitPreferencesStore } from "@/hooks/useOutfitPreferences";
import { useSaveOutfit } from "@/hooks/useSavedOutfits";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ClothingItem {
  id: string;
  image_url: string;
  category: string;
  sub_category: string | null;
}

interface OutfitResult {
  outfit: {
    upperBody: ClothingItem;
    lowerBody: ClothingItem;
    shoes: ClothingItem;
  };
  reasoning: string;
  styleNotes: string | null;
  preferences: {
    event: string;
    timeOfDay: string;
    season: string;
  };
}

export default function OutfitResults() {
  const navigate = useNavigate();
  const { preferences, resetPreferences } = useOutfitPreferencesStore();
  const [result, setResult] = useState<OutfitResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveOutfitMutation = useSaveOutfit();

  const generateOutfit = async () => {
    try {
      setError(null);
      const { data, error: fnError } = await supabase.functions.invoke("generate-outfit", {
        body: { preferences }
      });

      if (fnError) {
        throw fnError;
      }

      if (data.error) {
        setError(data.error);
        return;
      }

      setResult(data);
    } catch (err) {
      console.error("Error generating outfit:", err);
      setError(err instanceof Error ? err.message : "Failed to generate outfit");
    }
  };

  useEffect(() => {
    // Check if preferences are complete
    if (!preferences.event || !preferences.timeOfDay || !preferences.season) {
      toast.error("Please complete your preferences first");
      navigate("/generate");
      return;
    }

    setIsLoading(true);
    generateOutfit().finally(() => setIsLoading(false));
  }, []);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setIsSaved(false);
    await generateOutfit();
    setIsRegenerating(false);
    toast.success("New outfit generated!");
  };

  const handleSave = async () => {
    if (!result) return;

    try {
      await saveOutfitMutation.mutateAsync({
        upperBodyId: result.outfit.upperBody.id,
        lowerBodyId: result.outfit.lowerBody.id,
        shoesId: result.outfit.shoes.id,
        event: result.preferences.event,
        timeOfDay: result.preferences.timeOfDay,
        season: result.preferences.season,
        aiReasoning: result.reasoning,
        styleNotes: result.styleNotes || undefined,
      });
      setIsSaved(true);
      toast.success("Look saved to My Looks!");
    } catch (err) {
      console.error("Error saving outfit:", err);
      toast.error("Failed to save outfit");
    }
  };

  const handleBack = () => {
    resetPreferences();
    navigate("/generate");
  };

  const handleGoHome = () => {
    resetPreferences();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-serif font-semibold">Creating Your Perfect Look</h2>
          <p className="text-muted-foreground text-sm">Our AI stylist is analyzing your wardrobe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold font-serif">Outfit Results</h1>
          </div>
        </header>

        <main className="flex-1 container max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center gap-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <span className="text-3xl">👔</span>
            </div>
            <h2 className="text-xl font-serif font-semibold">Unable to Generate Outfit</h2>
            <p className="text-muted-foreground max-w-sm">{error}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleGoHome}>
              Add More Clothes
            </Button>
            <Button onClick={handleBack}>
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!result) return null;

  const outfitItems = [
    { label: "Upper Body", item: result.outfit.upperBody },
    { label: "Lower Body", item: result.outfit.lowerBody },
    { label: "Shoes", item: result.outfit.shoes },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold font-serif">Your Styled Look</h1>
            <p className="text-xs text-muted-foreground">
              {result.preferences.event} • {result.preferences.timeOfDay} • {result.preferences.season}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* AI Reasoning Bubble */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-4 relative">
          <div className="absolute -top-3 left-4 bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            AI Stylist
          </div>
          <p className="text-sm leading-relaxed mt-1">{result.reasoning}</p>
          {result.styleNotes && (
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-accent/20">
              💡 {result.styleNotes}
            </p>
          )}
        </div>

        {/* Outfit Display */}
        <div className="space-y-4">
          {outfitItems.map(({ label, item }) => (
            <div 
              key={item.id}
              className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm"
            >
              <div className="aspect-[4/3] relative bg-secondary">
                <img
                  src={item.image_url}
                  alt={item.sub_category || label}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
                <h3 className="font-medium font-serif text-lg">{item.sub_category || "Item"}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Action Buttons */}
      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border p-4">
        <div className="container max-w-2xl mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex-1 h-12"
          >
            {isRegenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Regenerate
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaved || saveOutfitMutation.isPending}
            className={cn(
              "flex-1 h-12",
              isSaved 
                ? "bg-green-600 hover:bg-green-600" 
                : "bg-accent text-accent-foreground hover:bg-accent/90"
            )}
          >
            {saveOutfitMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isSaved ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Heart className="w-4 h-4 mr-2" />
            )}
            {isSaved ? "Saved!" : "Save Look"}
          </Button>
        </div>
      </footer>
    </div>
  );
}
