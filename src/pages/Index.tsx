import { Link } from "react-router-dom";
import { WardrobeTabs } from "@/components/wardrobe/WardrobeTabs";
import { Plus, Sparkles, Heart, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight">
                My Wardrobe
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your digital closet, curated by AI
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/my-looks">
                <Button variant="outline" className="gap-2">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">My Looks</span>
                </Button>
              </Link>
              <Link to="/composer">
                <Button variant="outline" className="gap-2 border-purple-500/50 text-purple-600 hover:bg-purple-50 hover:text-purple-700">
                  <PenTool className="w-4 h-4" />
                  <span className="hidden sm:inline">Composer</span>
                </Button>
              </Link>
              <Link to="/generate">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Generate Outfit</span>
                  <span className="sm:hidden">Outfit</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <WardrobeTabs />
      </main>

      {/* Floating Add Button */}
      <Link
        to="/add"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
};

export default Index;
