import { CalendarOutfit } from "@/hooks/useCalendarOutfits";

interface MiniOutfitCompositionProps {
  outfit: CalendarOutfit;
  size?: "sm" | "md";
}

export const MiniOutfitComposition = ({ outfit, size = "sm" }: MiniOutfitCompositionProps) => {
  const sizeClasses = size === "sm" ? "h-full" : "h-24";
  
  return (
    <div className={`relative ${sizeClasses} flex flex-col items-center justify-between py-0.5`}>
      {/* Upper Body - Top 20% */}
      {outfit.upper_body && (
        <div className="relative h-[30%] w-full flex items-center justify-center">
          <img
            src={outfit.upper_body.image_url}
            alt="Top"
            className="max-h-full max-w-[90%] object-contain"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
          />
        </div>
      )}
      
      {/* Lower Body - Middle 50% */}
      {outfit.lower_body && (
        <div className="relative h-[40%] w-full flex items-center justify-center">
          <img
            src={outfit.lower_body.image_url}
            alt="Bottom"
            className="max-h-full max-w-[90%] object-contain"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
          />
        </div>
      )}
      
      {/* Shoes - Bottom 30% */}
      {outfit.shoes && (
        <div className="relative h-[25%] w-full flex items-center justify-center">
          <img
            src={outfit.shoes.image_url}
            alt="Shoes"
            className="max-h-full max-w-[90%] object-contain"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
          />
        </div>
      )}
    </div>
  );
};
