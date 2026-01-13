import { forwardRef } from "react";
import { format } from "date-fns";
import { ClothingItem } from "@/hooks/useClothes";
import { Sparkles, Sun, Cloud, CloudRain, Snowflake } from "lucide-react";

interface ClothingPosition {
  y: number;
  scale: number;
}

interface SmartShareCardProps {
  title: string;
  stylingTip?: string;
  weatherIcon?: "sun" | "cloud" | "rain" | "snow";
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

export const SmartShareCard = forwardRef<HTMLDivElement, SmartShareCardProps>(
  ({ title, stylingTip, weatherIcon = "sun", selectedItems, positions }, ref) => {
    const today = new Date();
    const dayName = format(today, "EEEE");
    const dateStr = format(today, "MMM d");

    const WeatherIcon = () => {
      const iconClass = "w-6 h-6";
      switch (weatherIcon) {
        case "sun": return <Sun className={`${iconClass} text-yellow-400`} />;
        case "cloud": return <Cloud className={`${iconClass} text-gray-400`} />;
        case "rain": return <CloudRain className={`${iconClass} text-blue-400`} />;
        case "snow": return <Snowflake className={`${iconClass} text-cyan-300`} />;
        default: return <Sun className={`${iconClass} text-yellow-400`} />;
      }
    };

    // Zone positions for the mannequin composition
    const zoneStyles = {
      upper: { top: "8%", height: "32%" },
      lower: { top: "38%", height: "35%" },
      shoes: { top: "72%", height: "18%" },
    };

    // Determine primary color from items for styling tip
    const primaryColors = [
      ...(selectedItems.upper?.colors || []),
      ...(selectedItems.lower?.colors || []),
      ...(selectedItems.shoes?.colors || []),
    ].slice(0, 2);

    const defaultTip = primaryColors.length > 0
      ? `${primaryColors.join(" & ")} vibes for a perfect day`
      : "A perfectly curated look for you";

    return (
      <div
        ref={ref}
        className="relative overflow-hidden"
        style={{
          width: "1080px",
          height: "1920px",
          background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 25%, #3B82F6 50%, #0EA5E9 75%, #38BDF8 100%)",
        }}
      >
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0%, transparent 40%)`,
          }}
        />

        {/* Top Text Block */}
        <div className="absolute top-16 right-12 text-right z-10">
          {/* Date & Day */}
          <div className="mb-3">
            <p className="text-white/90 text-4xl font-serif font-semibold">
              {dayName}
            </p>
            <p className="text-white/70 text-2xl">
              {dateStr}
            </p>
          </div>
          
          {/* AI Styling Tip */}
          <div className="max-w-[400px] bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white/80 text-sm font-medium">AI Styling Tip</span>
            </div>
            <p className="text-white text-xl leading-relaxed">
              {stylingTip || defaultTip}
            </p>
          </div>
          
          {/* Weather Icon */}
          <div className="mt-4 flex items-center justify-end gap-2">
            <WeatherIcon />
          </div>
        </div>

        {/* Title at Top Left */}
        <div className="absolute top-16 left-12 z-10">
          <h1 className="text-white text-5xl font-serif font-bold max-w-[500px] leading-tight drop-shadow-lg">
            {title || "Today's Look"}
          </h1>
        </div>

        {/* Outfit Composition - Center/Left */}
        <div 
          className="absolute left-12 top-1/2 -translate-y-1/2"
          style={{ width: "500px", height: "1100px" }}
        >
          {/* Glow Effect */}
          <div 
            className="absolute inset-0 -z-10"
            style={{
              background: "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 60%)",
            }}
          />
          
          {/* Upper Body */}
          {selectedItems.upper && (
            <div
              className="absolute left-1/2 flex items-center justify-center"
              style={{
                top: zoneStyles.upper.top,
                height: zoneStyles.upper.height,
                width: "90%",
                transform: `translateX(-50%) translateY(${positions.upper.y}px) scale(${positions.upper.scale})`,
              }}
            >
              <img
                src={selectedItems.upper.image_url}
                alt="Upper body"
                className="max-w-full max-h-full object-contain"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))" }}
                crossOrigin="anonymous"
              />
            </div>
          )}
          
          {/* Lower Body */}
          {selectedItems.lower && (
            <div
              className="absolute left-1/2 flex items-center justify-center"
              style={{
                top: zoneStyles.lower.top,
                height: zoneStyles.lower.height,
                width: "90%",
                transform: `translateX(-50%) translateY(${positions.lower.y}px) scale(${positions.lower.scale})`,
              }}
            >
              <img
                src={selectedItems.lower.image_url}
                alt="Lower body"
                className="max-w-full max-h-full object-contain"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))" }}
                crossOrigin="anonymous"
              />
            </div>
          )}
          
          {/* Shoes */}
          {selectedItems.shoes && (
            <div
              className="absolute left-1/2 flex items-center justify-center"
              style={{
                top: zoneStyles.shoes.top,
                height: zoneStyles.shoes.height,
                width: "70%",
                transform: `translateX(-50%) translateY(${positions.shoes.y}px) scale(${positions.shoes.scale})`,
              }}
            >
              <img
                src={selectedItems.shoes.image_url}
                alt="Shoes"
                className="max-w-full max-h-full object-contain"
                style={{ filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.4))" }}
                crossOrigin="anonymous"
              />
            </div>
          )}
        </div>

        {/* Item Details - Bottom Right */}
        <div className="absolute bottom-32 right-12 text-right z-10">
          <div className="space-y-2">
            {selectedItems.upper && (
              <div className="flex items-center justify-end gap-2">
                <span className="text-white/60 text-lg">Top:</span>
                <span className="text-white text-lg font-medium">
                  {selectedItems.upper.sub_category || "Top"}
                  {selectedItems.upper.colors?.[0] && ` · ${selectedItems.upper.colors[0]}`}
                </span>
              </div>
            )}
            {selectedItems.lower && (
              <div className="flex items-center justify-end gap-2">
                <span className="text-white/60 text-lg">Bottom:</span>
                <span className="text-white text-lg font-medium">
                  {selectedItems.lower.sub_category || "Bottom"}
                  {selectedItems.lower.colors?.[0] && ` · ${selectedItems.lower.colors[0]}`}
                </span>
              </div>
            )}
            {selectedItems.shoes && (
              <div className="flex items-center justify-end gap-2">
                <span className="text-white/60 text-lg">Shoes:</span>
                <span className="text-white text-lg font-medium">
                  {selectedItems.shoes.sub_category || "Shoes"}
                  {selectedItems.shoes.colors?.[0] && ` · ${selectedItems.shoes.colors[0]}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* App Branding - Bottom */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-lg font-medium">
              Universal AI Stylist
            </p>
            <p className="text-white/50 text-sm">
              Your personal fashion assistant
            </p>
          </div>
        </div>
      </div>
    );
  }
);

SmartShareCard.displayName = "SmartShareCard";
