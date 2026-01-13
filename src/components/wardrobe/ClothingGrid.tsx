import { ClothingItem } from "@/hooks/useClothes";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface ClothingGridProps {
  items: ClothingItem[];
  isLoading?: boolean;
}

export const ClothingGrid = ({ items, isLoading }: ClothingGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
          <svg
            className="w-10 h-10 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-foreground mb-2">No items found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or add new pieces to your wardrobe
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative aspect-square rounded-lg overflow-hidden bg-muted border border-border hover:border-accent transition-all duration-300"
        >
          <img
            src={item.image_url}
            alt={item.sub_category || item.category}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
              <span className="text-sm font-medium text-primary-foreground block">
                {item.sub_category || "Item"}
              </span>
              {/* Show tags on hover */}
              <div className="flex flex-wrap gap-1">
                {item.colors?.slice(0, 2).map((color) => (
                  <Badge 
                    key={color} 
                    variant="secondary" 
                    className="text-[10px] px-1.5 py-0 bg-background/20 text-primary-foreground border-0"
                  >
                    {color}
                  </Badge>
                ))}
                {item.styles?.slice(0, 1).map((style) => (
                  <Badge 
                    key={style} 
                    variant="secondary" 
                    className="text-[10px] px-1.5 py-0 bg-accent/30 text-primary-foreground border-0"
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          {/* Always visible label */}
          {item.sub_category && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-3 group-hover:opacity-0 transition-opacity">
              <span className="text-xs font-medium text-primary-foreground">
                {item.sub_category}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
