import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "imageUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing clothing image for global fashion categorization:", imageUrl);

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
            content: `You are a Universal AI Fashion Expert with deep knowledge of clothing from across the entire world.

GLOBAL FASHION EXPERTISE:
- You recognize Western business wear, casual street style, and high fashion
- You identify traditional garments from ALL cultures: sarees, kimonos, hanboks, dashikis, kaftans, ao dai, kurtas, abayas, dirndls, kilts, ponchos, guayaberas, cheongsams, and many more
- You understand luxury brands, fast fashion, and artisanal clothing equally
- You recognize fabrics from silk and cashmere to kente and batik

YOUR TASK:
Analyze the clothing image and extract:
1. Category (exactly one of: "Upper Body", "Lower Body", "Shoes", "Accessories")
2. Sub-category (specific type like "Kimono", "Denim Jacket", "Saree Blouse", "Oxford Shoes", etc.)
3. Colors (array of 1-3 primary colors visible)
4. Materials/Fabrics (array of 1-3 materials like "Silk", "Denim", "Cotton", "Wool", "Leather", "Kente", "Batik", etc.)
5. Styles/Vibes (array of 1-3 style descriptors like "Formal", "Casual", "Traditional", "Streetwear", "Minimalist", "Bohemian", "Ethnic", "Luxury", "Vintage", etc.)

Be culturally aware and respectful. Recognize the global diversity of fashion.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this clothing item image. Identify its category, specific type, colors, materials, and style descriptors."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "categorize_clothing",
              description: "Categorize a clothing item from an image with comprehensive global fashion awareness",
              parameters: {
                type: "object",
                properties: {
                  category: {
                    type: "string",
                    enum: ["Upper Body", "Lower Body", "Shoes", "Accessories"],
                    description: "The main category of the clothing item"
                  },
                  sub_category: {
                    type: "string",
                    description: "A specific description of the item (e.g., 'Denim Jacket', 'Kimono', 'Saree', 'Chelsea Boots')"
                  },
                  colors: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of 1-3 primary colors (e.g., ['Navy Blue', 'White'] or ['Crimson Red'])"
                  },
                  materials: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of 1-3 fabrics/materials (e.g., ['Silk', 'Cotton'] or ['Denim', 'Leather'])"
                  },
                  styles: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of 1-3 style descriptors (e.g., ['Formal', 'Minimalist'] or ['Traditional', 'Ethnic'])"
                  }
                },
                required: ["category", "sub_category", "colors", "materials", "styles"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "categorize_clothing" } }
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
      throw new Error("Failed to categorize image");
    }

    const data = await response.json();
    
    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("No categorization result from AI");
    }

    const result = JSON.parse(toolCall.function.arguments);
    
    console.log("AI categorization result:", JSON.stringify(result, null, 2));
    
    // Ensure arrays have defaults
    const finalResult = {
      category: result.category,
      sub_category: result.sub_category,
      colors: result.colors || [],
      materials: result.materials || [],
      styles: result.styles || []
    };
    
    return new Response(
      JSON.stringify(finalResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("categorize-clothing error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
