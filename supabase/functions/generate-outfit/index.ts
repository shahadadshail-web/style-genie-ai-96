import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ClothingItem {
  id: string;
  image_url: string;
  category: string;
  sub_category: string | null;
}

interface OutfitPreferences {
  event: string;
  customEvent?: string;
  timeOfDay: string;
  customTime?: string;
  season: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences }: { preferences: OutfitPreferences } = await req.json();
    
    if (!preferences) {
      return new Response(
        JSON.stringify({ error: "preferences are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration is missing");
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch all clothes from the database
    const { data: clothes, error: dbError } = await supabase
      .from("clothes")
      .select("*");

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to fetch wardrobe items");
    }

    if (!clothes || clothes.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "Your wardrobe is empty. Please add some clothes first.",
          isEmpty: true 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Group clothes by category
    const upperBody = clothes.filter((c: ClothingItem) => c.category === "Upper Body");
    const lowerBody = clothes.filter((c: ClothingItem) => c.category === "Lower Body");
    const shoes = clothes.filter((c: ClothingItem) => c.category === "Shoes");

    // Check if we have at least one item in required categories
    const missingCategories: string[] = [];
    if (upperBody.length === 0) missingCategories.push("Upper Body");
    if (lowerBody.length === 0) missingCategories.push("Lower Body");
    if (shoes.length === 0) missingCategories.push("Shoes");

    if (missingCategories.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: `Missing items in: ${missingCategories.join(", ")}. Please add items to complete outfit generation.`,
          missingCategories 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the event description
    const eventDescription = preferences.event === "Other" && preferences.customEvent 
      ? preferences.customEvent 
      : preferences.event;

    const timeDescription = preferences.timeOfDay === "Custom" && preferences.customTime
      ? preferences.customTime
      : preferences.timeOfDay;

    // Create wardrobe inventory for AI
    const wardrobeInventory = {
      upperBody: upperBody.map((item: ClothingItem) => ({
        id: item.id,
        type: item.sub_category || "Unknown Item",
        imageUrl: item.image_url
      })),
      lowerBody: lowerBody.map((item: ClothingItem) => ({
        id: item.id,
        type: item.sub_category || "Unknown Item",
        imageUrl: item.image_url
      })),
      shoes: shoes.map((item: ClothingItem) => ({
        id: item.id,
        type: item.sub_category || "Unknown Item",
        imageUrl: item.image_url
      }))
    };

    console.log("Generating outfit for:", { eventDescription, timeDescription, season: preferences.season });
    console.log("Wardrobe inventory:", JSON.stringify(wardrobeInventory, null, 2));

    // Call Gemini to generate outfit recommendation
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a Universal AI Fashion Stylist with deep knowledge of global fashion.

GLOBAL FASHION EXPERTISE:
- You understand Western business wear, casual street style, and high fashion
- You recognize traditional garments from ALL cultures worldwide (sarees, kimonos, hanboks, dashikis, kaftans, ao dai, etc.)
- You understand that "events" have different dress codes across cultures (a wedding in India vs Japan vs Brazil)
- You consider cultural context when making recommendations

STYLING PRINCIPLES:
- Match formality to the event
- Consider weather/season appropriateness
- Ensure color harmony and style cohesion
- Balance traditional and modern elements when applicable
- Respect cultural significance of garments

TASK: Select the best outfit combination from the user's wardrobe for their occasion.
You MUST select exactly one item from each category (Upper Body, Lower Body, Shoes).
If no perfect match exists, pick the closest suitable combination and explain why.`
          },
          {
            role: "user",
            content: `Here is my wardrobe inventory:

UPPER BODY OPTIONS:
${wardrobeInventory.upperBody.map((item, i) => `${i + 1}. ID: "${item.id}" - ${item.type}`).join("\n")}

LOWER BODY OPTIONS:
${wardrobeInventory.lowerBody.map((item, i) => `${i + 1}. ID: "${item.id}" - ${item.type}`).join("\n")}

SHOES OPTIONS:
${wardrobeInventory.shoes.map((item, i) => `${i + 1}. ID: "${item.id}" - ${item.type}`).join("\n")}

I need an outfit for:
- Event: ${eventDescription}
- Time: ${timeDescription}
- Season: ${preferences.season}

Please select the best combination and explain your choice.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "recommend_outfit",
              description: "Recommend a complete outfit from the user's wardrobe",
              parameters: {
                type: "object",
                properties: {
                  upperBodyId: {
                    type: "string",
                    description: "The exact ID of the selected upper body item"
                  },
                  upperBodyName: {
                    type: "string",
                    description: "The name/type of the upper body item"
                  },
                  lowerBodyId: {
                    type: "string",
                    description: "The exact ID of the selected lower body item"
                  },
                  lowerBodyName: {
                    type: "string",
                    description: "The name/type of the lower body item"
                  },
                  shoesId: {
                    type: "string",
                    description: "The exact ID of the selected shoes item"
                  },
                  shoesName: {
                    type: "string",
                    description: "The name/type of the shoes item"
                  },
                  reasoning: {
                    type: "string",
                    description: "A concise 2-3 sentence explanation of why this outfit works for the occasion, mentioning specific items and how they complement each other"
                  },
                  styleNotes: {
                    type: "string",
                    description: "Optional styling tips or accessories suggestions"
                  }
                },
                required: ["upperBodyId", "upperBodyName", "lowerBodyId", "lowerBodyName", "shoesId", "shoesName", "reasoning"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "recommend_outfit" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate outfit recommendation");
    }

    const data = await response.json();
    
    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("No outfit recommendation from AI");
    }

    const recommendation = JSON.parse(toolCall.function.arguments);
    console.log("AI Recommendation:", recommendation);

    // Find the actual items from the wardrobe
    const selectedUpperBody = clothes.find((c: ClothingItem) => c.id === recommendation.upperBodyId);
    const selectedLowerBody = clothes.find((c: ClothingItem) => c.id === recommendation.lowerBodyId);
    const selectedShoes = clothes.find((c: ClothingItem) => c.id === recommendation.shoesId);

    // Validate all items were found
    if (!selectedUpperBody || !selectedLowerBody || !selectedShoes) {
      console.error("Item matching failed:", {
        upperBodyId: recommendation.upperBodyId,
        lowerBodyId: recommendation.lowerBodyId,
        shoesId: recommendation.shoesId,
        foundUpper: !!selectedUpperBody,
        foundLower: !!selectedLowerBody,
        foundShoes: !!selectedShoes
      });
      
      // Fallback: return first items from each category
      return new Response(
        JSON.stringify({
          outfit: {
            upperBody: upperBody[0],
            lowerBody: lowerBody[0],
            shoes: shoes[0]
          },
          reasoning: "I've selected a versatile combination that should work well for your occasion. Consider experimenting with different combinations!",
          styleNotes: recommendation.styleNotes || null,
          preferences: {
            event: eventDescription,
            timeOfDay: timeDescription,
            season: preferences.season
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        outfit: {
          upperBody: selectedUpperBody,
          lowerBody: selectedLowerBody,
          shoes: selectedShoes
        },
        reasoning: recommendation.reasoning,
        styleNotes: recommendation.styleNotes || null,
        preferences: {
          event: eventDescription,
          timeOfDay: timeDescription,
          season: preferences.season
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-outfit error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
