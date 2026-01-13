import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClothingGrid } from "./ClothingGrid";
import { SmartFilter } from "./SmartFilter";
import { useClothes, ClothingCategory, ClothingFilters } from "@/hooks/useClothes";

const TABS: { value: ClothingCategory; label: string }[] = [
  { value: "Upper Body", label: "Tops" },
  { value: "Lower Body", label: "Bottoms" },
  { value: "Shoes", label: "Shoes" },
  { value: "Accessories", label: "Accessories" },
];

export const WardrobeTabs = () => {
  const [filters, setFilters] = useState<ClothingFilters>({});
  
  const { data: upperBody = [], isLoading: loadingUpper } = useClothes("Upper Body", filters);
  const { data: lowerBody = [], isLoading: loadingLower } = useClothes("Lower Body", filters);
  const { data: shoes = [], isLoading: loadingShoes } = useClothes("Shoes", filters);
  const { data: accessories = [], isLoading: loadingAccessories } = useClothes("Accessories", filters);

  const dataMap: Record<ClothingCategory, { items: typeof upperBody; loading: boolean }> = {
    "Upper Body": { items: upperBody, loading: loadingUpper },
    "Lower Body": { items: lowerBody, loading: loadingLower },
    "Shoes": { items: shoes, loading: loadingShoes },
    "Accessories": { items: accessories, loading: loadingAccessories },
  };

  return (
    <div className="space-y-4">
      <SmartFilter filters={filters} onFiltersChange={setFilters} />
      
      <Tabs defaultValue="Upper Body" className="w-full">
        <TabsList className="w-full justify-start gap-2 bg-transparent border-b border-border rounded-none p-0 h-auto">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative px-4 py-3 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            <ClothingGrid 
              items={dataMap[tab.value].items} 
              isLoading={dataMap[tab.value].loading} 
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
