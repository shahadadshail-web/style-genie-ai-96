import { useState } from "react";
import { useClothes, ClothingCategory, ClothingItem } from "@/hooks/useClothes";
import { cn } from "@/lib/utils";
import { Shirt, Footprints, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WardrobePanelProps {
  onSelectItem: (item: ClothingItem) => void;
  selectedItems: {
    upper: ClothingItem | null;
    lower: ClothingItem | null;
    shoes: ClothingItem | null;
  };
}

const categories: { key: ClothingCategory; label: string; icon: React.ReactNode }[] = [
  { key: "Upper Body", label: "Tops", icon: <Shirt className="w-4 h-4" /> },
  { key: "Lower Body", label: "Bottoms", icon: <Sparkles className="w-4 h-4" /> },
  { key: "Shoes", label: "Shoes", icon: <Footprints className="w-4 h-4" /> },
];

export const WardrobePanel = ({ onSelectItem, selectedItems }: WardrobePanelProps) => {
  const [activeCategory, setActiveCategory] = useState<ClothingCategory>("Upper Body");
  const { data: clothes, isLoading } = useClothes(activeCategory);

  const getSelectedId = (category: ClothingCategory) => {
    if (category === "Upper Body") return selectedItems.upper?.id;
    if (category === "Lower Body") return selectedItems.lower?.id;
    if (category === "Shoes") return selectedItems.shoes?.id;
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-card/50 backdrop-blur-sm rounded-2xl border border-border overflow-hidden">
      {/* Category Tabs */}
      <div className="flex border-b border-border">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              "flex-1 px-3 py-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors",
              activeCategory === cat.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {cat.icon}
            <span className="hidden sm:inline">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : clothes && clothes.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {clothes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={cn(
                    "aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 relative group",
                    getSelectedId(activeCategory) === item.id
                      ? "border-purple-500 ring-2 ring-purple-500/30"
                      : "border-transparent hover:border-muted-foreground/30"
                  )}
                >
                  <img
                    src={item.image_url}
                    alt={item.sub_category || item.category}
                    className="w-full h-full object-cover"
                  />
                  {getSelectedId(activeCategory) === item.id && (
                    <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                      <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        Selected
                      </div>
                    </div>
                  )}
                  {/* Hover info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">
                      {item.sub_category || item.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No items in this category
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
