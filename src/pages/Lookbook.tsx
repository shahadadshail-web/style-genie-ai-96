import { Link } from "react-router-dom";
import { ArrowLeft, Calendar as CalendarIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OutfitCalendar } from "@/components/calendar/OutfitCalendar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Lookbook() {
  const { signOut, user } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-semibold flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-purple-500" />
                  My Lookbook
                </h1>
                <p className="text-sm text-muted-foreground">
                  Plan your outfits for every day
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.email}
              </span>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-6">
        <OutfitCalendar />
      </main>
    </div>
  );
}
