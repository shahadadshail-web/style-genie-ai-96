export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      calendar_outfits: {
        Row: {
          created_at: string
          id: string
          location: string | null
          lower_body_id: string | null
          notes: string | null
          scheduled_date: string
          shoes_id: string | null
          updated_at: string
          upper_body_id: string | null
          user_id: string
          weather_text: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          lower_body_id?: string | null
          notes?: string | null
          scheduled_date: string
          shoes_id?: string | null
          updated_at?: string
          upper_body_id?: string | null
          user_id: string
          weather_text?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          lower_body_id?: string | null
          notes?: string | null
          scheduled_date?: string
          shoes_id?: string | null
          updated_at?: string
          upper_body_id?: string | null
          user_id?: string
          weather_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_outfits_lower_body_id_fkey"
            columns: ["lower_body_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_outfits_shoes_id_fkey"
            columns: ["shoes_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_outfits_upper_body_id_fkey"
            columns: ["upper_body_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
        ]
      }
      clothes: {
        Row: {
          category: Database["public"]["Enums"]["clothing_category"]
          colors: string[] | null
          created_at: string
          id: string
          image_url: string
          materials: string[] | null
          styles: string[] | null
          sub_category: string | null
          user_id: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["clothing_category"]
          colors?: string[] | null
          created_at?: string
          id?: string
          image_url: string
          materials?: string[] | null
          styles?: string[] | null
          sub_category?: string | null
          user_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["clothing_category"]
          colors?: string[] | null
          created_at?: string
          id?: string
          image_url?: string
          materials?: string[] | null
          styles?: string[] | null
          sub_category?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          body_shape: string | null
          created_at: string
          display_name: string | null
          height_cm: number | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          body_shape?: string | null
          created_at?: string
          display_name?: string | null
          height_cm?: number | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          body_shape?: string | null
          created_at?: string
          display_name?: string | null
          height_cm?: number | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_outfits: {
        Row: {
          ai_reasoning: string | null
          created_at: string
          event: string | null
          id: string
          lower_body_id: string
          name: string | null
          season: string | null
          shoes_id: string
          style_notes: string | null
          time_of_day: string | null
          upper_body_id: string
          user_id: string | null
        }
        Insert: {
          ai_reasoning?: string | null
          created_at?: string
          event?: string | null
          id?: string
          lower_body_id: string
          name?: string | null
          season?: string | null
          shoes_id: string
          style_notes?: string | null
          time_of_day?: string | null
          upper_body_id: string
          user_id?: string | null
        }
        Update: {
          ai_reasoning?: string | null
          created_at?: string
          event?: string | null
          id?: string
          lower_body_id?: string
          name?: string | null
          season?: string | null
          shoes_id?: string
          style_notes?: string | null
          time_of_day?: string | null
          upper_body_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_outfits_lower_body_id_fkey"
            columns: ["lower_body_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_outfits_shoes_id_fkey"
            columns: ["shoes_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_outfits_upper_body_id_fkey"
            columns: ["upper_body_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      clothing_category: "Upper Body" | "Lower Body" | "Shoes" | "Accessories"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      clothing_category: ["Upper Body", "Lower Body", "Shoes", "Accessories"],
    },
  },
} as const
