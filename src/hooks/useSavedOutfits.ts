import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClothingItem } from "./useClothes";

export interface SavedOutfit {
  id: string;
  name: string | null;
  upper_body_id: string;
  lower_body_id: string;
  shoes_id: string;
  event: string | null;
  time_of_day: string | null;
  season: string | null;
  ai_reasoning: string | null;
  style_notes: string | null;
  created_at: string;
  // Joined data
  upper_body?: ClothingItem;
  lower_body?: ClothingItem;
  shoes?: ClothingItem;
}

export const useSavedOutfits = () => {
  return useQuery({
    queryKey: ["saved_outfits"],
    queryFn: async () => {
      // Fetch saved outfits
      const { data: outfits, error: outfitsError } = await supabase
        .from("saved_outfits")
        .select("*")
        .order("created_at", { ascending: false });

      if (outfitsError) throw outfitsError;

      // Fetch all clothes to join
      const { data: clothes, error: clothesError } = await supabase
        .from("clothes")
        .select("*");

      if (clothesError) throw clothesError;

      const clothesMap = new Map(clothes.map((c) => [c.id, c]));

      // Join the data
      const enrichedOutfits: SavedOutfit[] = outfits.map((outfit) => ({
        ...outfit,
        upper_body: clothesMap.get(outfit.upper_body_id) as ClothingItem | undefined,
        lower_body: clothesMap.get(outfit.lower_body_id) as ClothingItem | undefined,
        shoes: clothesMap.get(outfit.shoes_id) as ClothingItem | undefined,
      }));

      return enrichedOutfits;
    },
  });
};

export interface SaveOutfitParams {
  upperBodyId: string;
  lowerBodyId: string;
  shoesId: string;
  event?: string;
  timeOfDay?: string;
  season?: string;
  aiReasoning?: string;
  styleNotes?: string;
  name?: string;
}

export const useSaveOutfit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SaveOutfitParams) => {
      const { data, error } = await supabase
        .from("saved_outfits")
        .insert({
          upper_body_id: params.upperBodyId,
          lower_body_id: params.lowerBodyId,
          shoes_id: params.shoesId,
          event: params.event || null,
          time_of_day: params.timeOfDay || null,
          season: params.season || null,
          ai_reasoning: params.aiReasoning || null,
          style_notes: params.styleNotes || null,
          name: params.name || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved_outfits"] });
    },
  });
};

export const useDeleteSavedOutfit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("saved_outfits").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved_outfits"] });
    },
  });
};
