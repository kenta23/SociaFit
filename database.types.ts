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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          content: string | null
          created_at: string
          distance_travelled: Json | null
          id: number
          steps_total: number | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          distance_travelled?: Json | null
          id?: number
          steps_total?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          distance_travelled?: Json | null
          id?: number
          steps_total?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      days_of_week: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      following: {
        Row: {
          created_at: string
          id: number
          user_followed: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          user_followed?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          user_followed?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      health_details: {
        Row: {
          age: number | null
          BMI: number | null
          created_at: string
          gender: string | null
          height: number | null
          id: number
          user_id: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          BMI?: number | null
          created_at?: string
          gender?: string | null
          height?: number | null
          id?: number
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          BMI?: number | null
          created_at?: string
          gender?: string | null
          height?: number | null
          id?: number
          user_id?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          activity: number | null
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          activity?: number | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          activity?: number | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_activity_fkey"
            columns: ["activity"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      userdata: {
        Row: {
          created_at: string
          ds_travelled: number | null
          id: number
          monthly_steps: number | null
          qr_code: string | null
          steps_goal: number | null
          streaks: number | null
          today_steps: number | null
          user_id: string | null
          weekly_steps: number | null
        }
        Insert: {
          created_at?: string
          ds_travelled?: number | null
          id?: number
          monthly_steps?: number | null
          qr_code?: string | null
          steps_goal?: number | null
          streaks?: number | null
          today_steps?: number | null
          user_id?: string | null
          weekly_steps?: number | null
        }
        Update: {
          created_at?: string
          ds_travelled?: number | null
          id?: number
          monthly_steps?: number | null
          qr_code?: string | null
          steps_goal?: number | null
          streaks?: number | null
          today_steps?: number | null
          user_id?: string | null
          weekly_steps?: number | null
        }
        Relationships: []
      }
      workout_categories: {
        Row: {
          category: string
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      workout_days: {
        Row: {
          created_at: string | null
          day: number
          id: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          day: number
          id?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          day?: number
          id?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_days_day_fkey"
            columns: ["day"]
            isOneToOne: false
            referencedRelation: "days_of_week"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_splits: {
        Row: {
          category_id: number | null
          created_at: string | null
          id: number
          workout_id: number | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          id?: number
          workout_id?: number | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          id?: number
          workout_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_splits_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "workout_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_splits_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workout_days"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
