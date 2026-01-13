import { useState } from "react";
import { ChevronUp, ChevronDown, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ClothingOverlayProps {
  imageUrl: string;
  zone: "upper" | "lower" | "shoes";
  isSelected: boolean;
  onSelect: () => void;
  position: { y: number; scale: number };
  onPositionChange: (position: { y: number; scale: number }) => void;
}

export const ClothingOverlay = ({
  imageUrl,
  zone,
  isSelected,
  onSelect,
  position,
  onPositionChange,
}: ClothingOverlayProps) => {
  const zoneStyles = {
    upper: {
      top: "8%",
      height: "35%",
      defaultY: 0,
    },
    lower: {
      top: "40%",
      height: "32%",
      defaultY: 0,
    },
    shoes: {
      top: "85%",
      height: "12%",
      defaultY: 0,
    },
  };

  const config = zoneStyles[zone];

  const handleNudge = (direction: "up" | "down") => {
    const delta = direction === "up" ? -5 : 5;
    onPositionChange({ ...position, y: position.y + delta });
  };

  const handleScale = (direction: "in" | "out") => {
    const delta = direction === "in" ? 0.1 : -0.1;
    const newScale = Math.max(0.5, Math.min(2, position.scale + delta));
    onPositionChange({ ...position, scale: newScale });
  };

  const handleReset = () => {
    onPositionChange({ y: 0, scale: 1 });
  };

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-200 cursor-pointer",
        isSelected && "ring-2 ring-purple-500 ring-offset-2 ring-offset-transparent rounded-lg"
      )}
      style={{
        top: config.top,
        height: config.height,
        width: "60%",
        transform: `translateX(-50%) translateY(${position.y}px) scale(${position.scale})`,
      }}
      onClick={onSelect}
    >
      <img
        src={imageUrl}
        alt={`${zone} clothing`}
        className="max-w-full max-h-full object-contain"
        style={{
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
          mixBlendMode: "multiply",
        }}
        draggable={false}
      />
      
      {/* Adjustment Controls */}
      {isSelected && (
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col gap-1 bg-card/90 backdrop-blur-sm p-1.5 rounded-lg border border-border shadow-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              handleNudge("up");
            }}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              handleNudge("down");
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="h-px bg-border my-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              handleScale("in");
            }}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              handleScale("out");
            }}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="h-px bg-border my-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
