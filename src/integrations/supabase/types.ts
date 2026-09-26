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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      books: {
        Row: {
          author: string | null
          color: string | null
          created_at: string
          current_page: number
          id: string
          status: string
          title: string
          total_pages: number
          user_id: string
        }
        Insert: {
          author?: string | null
          color?: string | null
          created_at?: string
          current_page?: number
          id?: string
          status?: string
          title: string
          total_pages?: number
          user_id?: string
        }
        Update: {
          author?: string | null
          color?: string | null
          created_at?: string
          current_page?: number
          id?: string
          status?: string
          title?: string
          total_pages?: number
          user_id?: string
        }
        Relationships: []
      }
      confessions: {
        Row: {
          day: string
          id: string
          ts: string
          user_id: string
        }
        Insert: {
          day: string
          id?: string
          ts?: string
          user_id?: string
        }
        Update: {
          day?: string
          id?: string
          ts?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_exercises: {
        Row: {
          created_at: string
          cue: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cue?: string | null
          id?: string
          name: string
          user_id?: string
        }
        Update: {
          created_at?: string
          cue?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_checkins: {
        Row: {
          bed: string | null
          day: string
          exame: boolean
          oracao: boolean
          sleep_quality: number | null
          terco: boolean
          updated_at: string
          user_id: string
          vitd: boolean
          wake: string | null
          water: number
        }
        Insert: {
          bed?: string | null
          day: string
          exame?: boolean
          oracao?: boolean
          sleep_quality?: number | null
          terco?: boolean
          updated_at?: string
          user_id?: string
          vitd?: boolean
          wake?: string | null
          water?: number
        }
        Update: {
          bed?: string | null
          day?: string
          exame?: boolean
          oracao?: boolean
          sleep_quality?: number | null
          terco?: boolean
          updated_at?: string
          user_id?: string
          vitd?: boolean
          wake?: string | null
          water?: number
        }
        Relationships: []
      }
      reading_sessions: {
        Row: {
          book_id: string | null
          day: string
          id: string
          note: string | null
          pages: number
          secs: number
          ts: string
          user_id: string
        }
        Insert: {
          book_id?: string | null
          day: string
          id?: string
          note?: string | null
          pages?: number
          secs?: number
          ts?: string
          user_id?: string
        }
        Update: {
          book_id?: string | null
          day?: string
          id?: string
          note?: string | null
          pages?: number
          secs?: number
          ts?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_sessions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          bed_target: string
          read_goal_min: number
          user_id: string
          wake_target: string
          water_goal: number
          week_plan: Json | null
          weight_goal: number
        }
        Insert: {
          bed_target?: string
          read_goal_min?: number
          user_id?: string
          wake_target?: string
          water_goal?: number
          week_plan?: Json | null
          weight_goal?: number
        }
        Update: {
          bed_target?: string
          read_goal_min?: number
          user_id?: string
          wake_target?: string
          water_goal?: number
          week_plan?: Json | null
          weight_goal?: number
        }
        Relationships: []
      }
      stretch_sessions: {
        Row: {
          day: string
          id: string
          secs: number
          ts: string
          user_id: string
        }
        Insert: {
          day: string
          id?: string
          secs?: number
          ts?: string
          user_id?: string
        }
        Update: {
          day?: string
          id?: string
          secs?: number
          ts?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          done: boolean
          done_at: string | null
          due: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          done?: boolean
          done_at?: string | null
          due?: string | null
          id?: string
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          done?: boolean
          done_at?: string | null
          due?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      weights: {
        Row: {
          day: string
          id: string
          kg: number
          ts: string
          user_id: string
        }
        Insert: {
          day: string
          id?: string
          kg: number
          ts?: string
          user_id?: string
        }
        Update: {
          day?: string
          id?: string
          kg?: number
          ts?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          created_at: string
          id: string
          items: Json
          name: string
          position: number
          rest_secs: number
          rounds: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          items?: Json
          name: string
          position?: number
          rest_secs?: number
          rounds?: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          name?: string
          position?: number
          rest_secs?: number
          rounds?: number
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          day: string
          id: string
          knee: number | null
          note: string | null
          rounds: number
          secs: number
          ts: string
          user_id: string
          workout: string
        }
        Insert: {
          day: string
          id?: string
          knee?: number | null
          note?: string | null
          rounds?: number
          secs?: number
          ts?: string
          user_id?: string
          workout: string
        }
        Update: {
          day?: string
          id?: string
          knee?: number | null
          note?: string | null
          rounds?: number
          secs?: number
          ts?: string
          user_id?: string
          workout?: string
        }
        Relationships: []
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
