import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Filter, X, Palette, Shirt, Sparkles } from "lucide-react";
import { useClothesFilterOptions, ClothingFilters } from "@/hooks/useClothes";
import { cn } from "@/lib/utils";

interface SmartFilterProps {
  filters: ClothingFilters;
  onFiltersChange: (filters: ClothingFilters) => void;
}

export const SmartFilter = ({ filters, onFiltersChange }: SmartFilterProps) => {
  const [open, setOpen] = useState(false);
  const { data: options, isLoading } = useClothesFilterOptions();

  const activeFilterCount = 
    (filters.colors?.length || 0) + 
    (filters.materials?.length || 0) + 
    (filters.styles?.length || 0);

  const toggleFilter = (type: keyof ClothingFilters, value: string) => {
    const currentValues = filters[type] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [type]: newValues.length > 0 ? newValues : undefined,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const FilterSection = ({ 
    title, 
    icon, 
    items, 
    type 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    items: string[]; 
    type: keyof ClothingFilters;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.length === 0 ? (
          <span className="text-xs text-muted-foreground italic">No options yet</span>
        ) : (
          items.map((item) => {
            const isSelected = filters[type]?.includes(item);
            return (
              <Badge
                key={item}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all text-xs",
                  isSelected 
                    ? "bg-accent text-accent-foreground hover:bg-accent/80" 
                    : "hover:bg-accent/10"
                )}
                onClick={() => toggleFilter(type, item)}
              >
                {item}
              </Badge>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "gap-2",
              activeFilterCount > 0 && "border-accent text-accent"
            )}
          >
            <Filter className="w-4 h-4" />
            Smart Filter
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-semibold">Filter Your Wardrobe</h4>
              {activeFilterCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="text-xs text-muted-foreground h-auto py-1"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading filters...</div>
            ) : (
              <>
                <FilterSection 
                  title="Color" 
                  icon={<Palette className="w-4 h-4" />} 
                  items={options?.colors || []} 
                  type="colors"
                />
                <Separator />
                <FilterSection 
                  title="Material" 
                  icon={<Shirt className="w-4 h-4" />} 
                  items={options?.materials || []} 
                  type="materials"
                />
                <Separator />
                <FilterSection 
                  title="Style" 
                  icon={<Sparkles className="w-4 h-4" />} 
                  items={options?.styles || []} 
                  type="styles"
                />
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.colors?.map(color => (
            <Badge 
              key={`color-${color}`} 
              variant="secondary" 
              className="gap-1 text-xs"
            >
              {color}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleFilter('colors', color)}
              />
            </Badge>
          ))}
          {filters.materials?.map(material => (
            <Badge 
              key={`material-${material}`} 
              variant="secondary" 
              className="gap-1 text-xs"
            >
              {material}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleFilter('materials', material)}
              />
            </Badge>
          ))}
          {filters.styles?.map(style => (
            <Badge 
              key={`style-${style}`} 
              variant="secondary" 
              className="gap-1 text-xs"
            >
              {style}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleFilter('styles', style)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
