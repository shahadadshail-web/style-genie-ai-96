import { forwardRef } from "react";
import { MannequinSilhouette } from "./MannequinSilhouette";
import { ClothingItem } from "@/hooks/useClothes";
import { Sparkles } from "lucide-react";

interface ClothingPosition {
  y: number;
  scale: number;
}

interface ShareOutfitCardProps {
  title: string;
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

export const ShareOutfitCard = forwardRef<HTMLDivElement, ShareOutfitCardProps>(
  ({ title, selectedItems, positions }, ref) => {
    const zoneStyles = {
      upper: { top: "8%", height: "35%" },
      lower: { top: "40%", height: "32%" },
      shoes: { top: "85%", height: "12%" },
    };

    // Gather item details for the footer
    const itemDetails = [
      selectedItems.upper && {
        label: "Top",
        colors: selectedItems.upper.colors?.slice(0, 2) || [],
        styles: selectedItems.upper.styles?.slice(0, 1) || [],
        subCategory: selectedItems.upper.sub_category,
      },
      selectedItems.lower && {
        label: "Bottom",
        colors: selectedItems.lower.colors?.slice(0, 2) || [],
        styles: selectedItems.lower.styles?.slice(0, 1) || [],
        subCategory: selectedItems.lower.sub_category,
      },
      selectedItems.shoes && {
        label: "Shoes",
        colors: selectedItems.shoes.colors?.slice(0, 2) || [],
        styles: selectedItems.shoes.styles?.slice(0, 1) || [],
        subCategory: selectedItems.shoes.sub_category,
      },
    ].filter(Boolean);

    return (
      <div
        ref={ref}
        className="w-[400px] bg-gradient-to-br from-slate-900 via-purple-950/80 to-slate-950 rounded-2xl border-2 border-purple-500/30 overflow-hidden shadow-2xl"
        style={{
          boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.1)",
        }}
      >
        {/* Header Section */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-purple-600/20 via-purple-500/10 to-transparent border-b border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-400 uppercase tracking-wider font-medium">
              Universal AI Stylist
            </span>
          </div>
          <h2 className="text-xl font-serif font-semibold text-white">
            {title || "My Curated Look"}
          </h2>
        </div>

        {/* Mannequin Section */}
        <div className="relative h-[380px] flex items-center justify-center px-8 py-6">
          {/* Subtle glow background */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3), transparent 70%)",
            }}
          />
          
          <div className="relative w-full max-w-[220px] h-[340px] mx-auto">
            {/* Mannequin Silhouette */}
            <MannequinSilhouette className="absolute inset-0 opacity-40" />
            
            {/* Clothing Overlays */}
            {selectedItems.upper && (
              <div
                className="absolute left-1/2 flex items-center justify-center"
                style={{
                  top: zoneStyles.upper.top,
                  height: zoneStyles.upper.height,
                  width: "70%",
                  transform: `translateX(-50%) translateY(${positions.upper.y}px) scale(${positions.upper.scale})`,
                }}
              >
                <img
                  src={selectedItems.upper.image_url}
                  alt="Upper body"
                  className="max-w-full max-h-full object-contain"
                  style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}
                  crossOrigin="anonymous"
                />
              </div>
            )}
            
            {selectedItems.lower && (
              <div
                className="absolute left-1/2 flex items-center justify-center"
                style={{
                  top: zoneStyles.lower.top,
                  height: zoneStyles.lower.height,
                  width: "70%",
                  transform: `translateX(-50%) translateY(${positions.lower.y}px) scale(${positions.lower.scale})`,
                }}
              >
                <img
                  src={selectedItems.lower.image_url}
                  alt="Lower body"
                  className="max-w-full max-h-full object-contain"
                  style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}
                  crossOrigin="anonymous"
                />
              </div>
            )}
            
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
                  style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}
                  crossOrigin="anonymous"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Section - Item Details */}
        <div className="px-6 py-4 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent border-t border-purple-500/20">
          <div className="space-y-2 mb-4">
            {itemDetails.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="text-purple-400 font-medium min-w-[60px]">
                  {item?.label}:
                </span>
                <span className="text-gray-300">
                  {item?.subCategory && `${item.subCategory}`}
                  {item?.colors && item.colors.length > 0 && (
                    <span className="text-purple-300/70"> · {item.colors.join(", ")}</span>
                  )}
                  {item?.styles && item.styles.length > 0 && (
                    <span className="text-gray-400"> · {item.styles[0]}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
          
          {/* App Branding */}
          <div className="flex items-center justify-center gap-2 pt-3 border-t border-purple-500/10">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-gray-400 tracking-wider">
              Created with <span className="text-purple-400 font-medium">Universal AI Stylist</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
);

ShareOutfitCard.displayName = "ShareOutfitCard";
