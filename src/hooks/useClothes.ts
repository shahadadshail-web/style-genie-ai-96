import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type ClothingCategory = "Upper Body" | "Lower Body" | "Shoes" | "Accessories";

export interface ClothingItem {
  id: string;
  image_url: string;
  category: ClothingCategory;
  sub_category: string | null;
  created_at: string;
  colors: string[];
  materials: string[];
  styles: string[];
}

export interface ClothingFilters {
  colors?: string[];
  materials?: string[];
  styles?: string[];
}

export const useClothes = (category?: ClothingCategory, filters?: ClothingFilters) => {
  return useQuery({
    queryKey: ["clothes", category, filters],
    queryFn: async () => {
      let query = supabase.from("clothes").select("*").order("created_at", { ascending: false });
      
      if (category) {
        query = query.eq("category", category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      let items = data as ClothingItem[];
      
      // Apply client-side filtering for arrays (Supabase array filtering is limited)
      if (filters) {
        if (filters.colors && filters.colors.length > 0) {
          items = items.filter(item => 
            item.colors?.some(color => 
              filters.colors!.some(filterColor => 
                color.toLowerCase().includes(filterColor.toLowerCase())
              )
            )
          );
        }
        
        if (filters.materials && filters.materials.length > 0) {
          items = items.filter(item => 
            item.materials?.some(material => 
              filters.materials!.some(filterMaterial => 
                material.toLowerCase().includes(filterMaterial.toLowerCase())
              )
            )
          );
        }
        
        if (filters.styles && filters.styles.length > 0) {
          items = items.filter(item => 
            item.styles?.some(style => 
              filters.styles!.some(filterStyle => 
                style.toLowerCase().includes(filterStyle.toLowerCase())
              )
            )
          );
        }
      }
      
      return items;
    },
  });
};

// Get all unique filter options from the wardrobe
export const useClothesFilterOptions = () => {
  return useQuery({
    queryKey: ["clothes", "filter-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clothes")
        .select("colors, materials, styles");
      
      if (error) throw error;
      
      const items = data as Pick<ClothingItem, 'colors' | 'materials' | 'styles'>[];
      
      const colorsSet = new Set<string>();
      const materialsSet = new Set<string>();
      const stylesSet = new Set<string>();
      
      items.forEach(item => {
        item.colors?.forEach(c => colorsSet.add(c));
        item.materials?.forEach(m => materialsSet.add(m));
        item.styles?.forEach(s => stylesSet.add(s));
      });
      
      return {
        colors: Array.from(colorsSet).sort(),
        materials: Array.from(materialsSet).sort(),
        styles: Array.from(stylesSet).sort(),
      };
    },
  });
};

export const useCategorizeImage = () => {
  return useMutation({
    mutationFn: async (imageUrl: string): Promise<{ 
      category: ClothingCategory; 
      sub_category: string;
      colors: string[];
      materials: string[];
      styles: string[];
    }> => {
      const { data, error } = await supabase.functions.invoke("categorize-clothing", {
        body: { imageUrl },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      return {
        category: data.category,
        sub_category: data.sub_category,
        colors: data.colors || [],
        materials: data.materials || [],
        styles: data.styles || [],
      };
    },
  });
};

export const useAddClothing = () => {
  const queryClient = useQueryClient();
  const categorizeMutation = useCategorizeImage();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({
      imageFile,
    }: {
      imageFile: File;
    }) => {
      if (!user) throw new Error("You must be logged in to add clothing");
      
      // Upload image to storage with user folder
      const fileExt = imageFile.name.split(".").pop() || "jpg";
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("wardrobe")
        .upload(fileName, imageFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from("wardrobe")
        .getPublicUrl(fileName);
      
      const imageUrl = urlData.publicUrl;
      
      // Use AI to categorize the image with full metadata
      const categorization = await categorizeMutation.mutateAsync(imageUrl);
      
      // Insert into clothes table with AI-determined category, metadata, and user_id
      const { data, error } = await supabase
        .from("clothes")
        .insert({
          image_url: imageUrl,
          category: categorization.category,
          sub_category: categorization.sub_category,
          colors: categorization.colors,
          materials: categorization.materials,
          styles: categorization.styles,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return { ...data, categorization };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
    },
  });
};

export const useDeleteClothing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clothes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clothes"] });
    },
  });
};
