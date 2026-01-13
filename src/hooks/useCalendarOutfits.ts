import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ClothingItem } from "./useClothes";

export interface CalendarOutfit {
  id: string;
  user_id: string;
  scheduled_date: string;
  upper_body_id: string | null;
  lower_body_id: string | null;
  shoes_id: string | null;
  weather_text: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  upper_body?: ClothingItem;
  lower_body?: ClothingItem;
  shoes?: ClothingItem;
}

export const useCalendarOutfits = (year: number, month: number) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["calendar_outfits", year, month, user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get first and last day of month
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      
      // Fetch calendar outfits for the month
      const { data: outfits, error: outfitsError } = await supabase
        .from("calendar_outfits")
        .select("*")
        .eq("user_id", user.id)
        .gte("scheduled_date", startDate)
        .lte("scheduled_date", endDate);

      if (outfitsError) throw outfitsError;

      // Fetch all clothes to join
      const { data: clothes, error: clothesError } = await supabase
        .from("clothes")
        .select("*");

      if (clothesError) throw clothesError;

      const clothesMap = new Map(clothes?.map((c) => [c.id, c]) || []);

      // Join the data
      const enrichedOutfits: CalendarOutfit[] = (outfits || []).map((outfit) => ({
        ...outfit,
        upper_body: clothesMap.get(outfit.upper_body_id) as ClothingItem | undefined,
        lower_body: clothesMap.get(outfit.lower_body_id) as ClothingItem | undefined,
        shoes: clothesMap.get(outfit.shoes_id) as ClothingItem | undefined,
      }));

      return enrichedOutfits;
    },
    enabled: !!user,
  });
};

export interface ScheduleOutfitParams {
  scheduledDate: string;
  upperBodyId?: string | null;
  lowerBodyId?: string | null;
  shoesId?: string | null;
  weatherText?: string;
  location?: string;
  notes?: string;
}

export const useScheduleOutfit = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: ScheduleOutfitParams) => {
      if (!user) throw new Error("Not authenticated");
      
      // Use upsert to handle existing dates
      const { data, error } = await supabase
        .from("calendar_outfits")
        .upsert({
          user_id: user.id,
          scheduled_date: params.scheduledDate,
          upper_body_id: params.upperBodyId || null,
          lower_body_id: params.lowerBodyId || null,
          shoes_id: params.shoesId || null,
          weather_text: params.weatherText || null,
          location: params.location || null,
          notes: params.notes || null,
        }, {
          onConflict: 'user_id,scheduled_date',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar_outfits"] });
    },
  });
};

export const useDeleteCalendarOutfit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("calendar_outfits")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar_outfits"] });
    },
  });
};

export const useCalendarOutfitByDate = (date: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["calendar_outfit", date, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("calendar_outfits")
        .select("*")
        .eq("user_id", user.id)
        .eq("scheduled_date", date)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;

      // Fetch clothes for this outfit
      const { data: clothes } = await supabase
        .from("clothes")
        .select("*");

      const clothesMap = new Map(clothes?.map((c) => [c.id, c]) || []);

      return {
        ...data,
        upper_body: clothesMap.get(data.upper_body_id) as ClothingItem | undefined,
        lower_body: clothesMap.get(data.lower_body_id) as ClothingItem | undefined,
        shoes: clothesMap.get(data.shoes_id) as ClothingItem | undefined,
      } as CalendarOutfit;
    },
    enabled: !!user && !!date,
  });
};
