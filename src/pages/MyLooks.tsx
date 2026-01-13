import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Sparkles, Calendar, Clock, Sun } from "lucide-react";
import { useSavedOutfits, useDeleteSavedOutfit } from "@/hooks/useSavedOutfits";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";

export default function MyLooks() {
  const { data: outfits = [], isLoading } = useSavedOutfits();
  const deleteMutation = useDeleteSavedOutfit();

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this saved look?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Look deleted"),
        onError: () => toast.error("Failed to delete look"),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold font-serif">My Looks</h1>
            <p className="text-xs text-muted-foreground">
              {outfits.length} saved outfit{outfits.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        ) : outfits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-accent/10 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-xl font-serif font-semibold mb-2">No Saved Looks Yet</h2>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Generate an outfit and save it to build your collection of perfect looks.
            </p>
            <Link to="/generate">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Outfit
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {outfits.map((outfit) => (
              <div
                key={outfit.id}
                className="group relative bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Outfit Collage */}
                <div className="aspect-[4/3] relative bg-secondary">
                  <div className="absolute inset-0 grid grid-cols-3 gap-0.5 p-0.5">
                    {/* Upper Body - takes left 2/3 of top half */}
                    <div className="col-span-2 row-span-1 relative overflow-hidden">
                      {outfit.upper_body ? (
                        <img
                          src={outfit.upper_body.image_url}
                          alt={outfit.upper_body.sub_category || "Upper Body"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Missing</span>
                        </div>
                      )}
                      <div className="absolute bottom-1 left-1 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-medium">
                        Top
                      </div>
                    </div>

                    {/* Lower Body - takes right 1/3 spanning both rows */}
                    <div className="row-span-2 relative overflow-hidden">
                      {outfit.lower_body ? (
                        <img
                          src={outfit.lower_body.image_url}
                          alt={outfit.lower_body.sub_category || "Lower Body"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Missing</span>
                        </div>
                      )}
                      <div className="absolute bottom-1 left-1 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-medium">
                        Bottom
                      </div>
                    </div>

                    {/* Shoes - takes left 2/3 of bottom half */}
                    <div className="col-span-2 row-span-1 relative overflow-hidden">
                      {outfit.shoes ? (
                        <img
                          src={outfit.shoes.image_url}
                          alt={outfit.shoes.sub_category || "Shoes"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Missing</span>
                        </div>
                      )}
                      <div className="absolute bottom-1 left-1 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-medium">
                        Shoes
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDelete(outfit.id, e)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Outfit Info */}
                <div className="p-4 space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {outfit.event && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent">
                        <Calendar className="w-3 h-3" />
                        {outfit.event}
                      </span>
                    )}
                    {outfit.time_of_day && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                        <Clock className="w-3 h-3" />
                        {outfit.time_of_day}
                      </span>
                    )}
                    {outfit.season && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                        <Sun className="w-3 h-3" />
                        {outfit.season}
                      </span>
                    )}
                  </div>

                  {/* AI Reasoning */}
                  {outfit.ai_reasoning && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {outfit.ai_reasoning}
                    </p>
                  )}

                  {/* Date */}
                  <p className="text-xs text-muted-foreground">
                    Saved {format(new Date(outfit.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
