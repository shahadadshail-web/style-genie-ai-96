import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Sparkles, Calendar, Sun, Moon, Snowflake, Flower2, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  useOutfitPreferencesStore, 
  EventType, 
  TimeOfDay, 
  Season 
} from "@/hooks/useOutfitPreferences";
import { toast } from "sonner";

const EVENTS: { value: EventType; label: string; icon: string }[] = [
  { value: "Marriage", label: "Marriage", icon: "💒" },
  { value: "Birthday", label: "Birthday", icon: "🎂" },
  { value: "Party", label: "Party", icon: "🎉" },
  { value: "Other", label: "Other", icon: "✨" },
];

const TIMES: { value: TimeOfDay; label: string; icon: React.ReactNode }[] = [
  { value: "Morning", label: "Morning", icon: <Sun className="w-5 h-5" /> },
  { value: "Night", label: "Night", icon: <Moon className="w-5 h-5" /> },
  { value: "Custom", label: "Custom", icon: <Calendar className="w-5 h-5" /> },
];

const SEASONS: { value: Season; label: string; icon: React.ReactNode }[] = [
  { value: "Summer", label: "Summer", icon: <Sun className="w-5 h-5 text-amber-500" /> },
  { value: "Winter", label: "Winter", icon: <Snowflake className="w-5 h-5 text-blue-400" /> },
  { value: "Spring", label: "Spring", icon: <Flower2 className="w-5 h-5 text-pink-400" /> },
  { value: "Fall", label: "Fall", icon: <Leaf className="w-5 h-5 text-orange-500" /> },
];

type Step = 1 | 2 | 3;

export default function GenerateOutfit() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [customEventInput, setCustomEventInput] = useState("");
  const [customTimeInput, setCustomTimeInput] = useState("");
  
  const { preferences, setEvent, setTimeOfDay, setSeason, isComplete } = useOutfitPreferencesStore();

  const handleEventSelect = (event: EventType) => {
    if (event === "Other") {
      setEvent(event, customEventInput);
    } else {
      setEvent(event);
      setCustomEventInput("");
    }
  };

  const handleTimeSelect = (time: TimeOfDay) => {
    if (time === "Custom") {
      setTimeOfDay(time, customTimeInput);
    } else {
      setTimeOfDay(time);
      setCustomTimeInput("");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return preferences.event && (preferences.event !== "Other" || customEventInput.trim());
      case 2:
        return preferences.timeOfDay && (preferences.timeOfDay !== "Custom" || customTimeInput.trim());
      case 3:
        return preferences.season;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step === 1 && preferences.event === "Other") {
      setEvent("Other", customEventInput);
    }
    if (step === 2 && preferences.timeOfDay === "Custom") {
      setTimeOfDay("Custom", customTimeInput);
    }
    
    if (step < 3) {
      setStep((step + 1) as Step);
    } else if (isComplete()) {
      navigate("/outfit-results");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold font-serif">Generate Outfit</h1>
            <p className="text-xs text-muted-foreground">Step {step} of 3</p>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-muted">
        <div 
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        {/* Step 1: Event */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-2">What's the occasion?</h2>
              <p className="text-muted-foreground text-sm">Select the event you're dressing for</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {EVENTS.map((event) => (
                <button
                  key={event.value}
                  onClick={() => handleEventSelect(event.value)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 transition-all duration-200",
                    preferences.event === event.value
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50 hover:bg-accent/5"
                  )}
                >
                  <span className="text-3xl">{event.icon}</span>
                  <span className="font-medium">{event.label}</span>
                </button>
              ))}
            </div>

            {preferences.event === "Other" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Input
                  placeholder="Describe your event..."
                  value={customEventInput}
                  onChange={(e) => {
                    setCustomEventInput(e.target.value);
                    setEvent("Other", e.target.value);
                  }}
                  className="h-12"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Time of Day */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-2">What time of day?</h2>
              <p className="text-muted-foreground text-sm">This helps us pick the right colors and styles</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {TIMES.map((time) => (
                <button
                  key={time.value}
                  onClick={() => handleTimeSelect(time.value)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
                    preferences.timeOfDay === time.value
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50 hover:bg-accent/5"
                  )}
                >
                  {time.icon}
                  <span className="font-medium text-sm">{time.label}</span>
                </button>
              ))}
            </div>

            {preferences.timeOfDay === "Custom" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Input
                  placeholder="e.g., Afternoon, Evening, Sunset..."
                  value={customTimeInput}
                  onChange={(e) => {
                    setCustomTimeInput(e.target.value);
                    setTimeOfDay("Custom", e.target.value);
                  }}
                  className="h-12"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Season */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-2">What season?</h2>
              <p className="text-muted-foreground text-sm">We'll consider weather-appropriate styling</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SEASONS.map((season) => (
                <button
                  key={season.value}
                  onClick={() => setSeason(season.value)}
                  className={cn(
                    "flex items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
                    preferences.season === season.value
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50 hover:bg-accent/5"
                  )}
                >
                  {season.icon}
                  <span className="font-medium">{season.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border p-4">
        <div className="container max-w-2xl mx-auto">
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
          >
            {step === 3 ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Find My Outfit
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
