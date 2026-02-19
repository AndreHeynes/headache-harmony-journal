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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      beta_email_queue: {
        Row: {
          created_at: string | null
          email: string
          email_type: string
          error_message: string | null
          full_name: string | null
          id: string
          retry_count: number | null
          scheduled_for: string
          sent_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          email_type: string
          error_message?: string | null
          full_name?: string | null
          id?: string
          retry_count?: number | null
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          email_type?: string
          error_message?: string | null
          full_name?: string | null
          id?: string
          retry_count?: number | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      episode_locations: {
        Row: {
          created_at: string
          episode_id: string
          id: string
          is_origin: boolean
          location_name: string
          notes: string | null
          pain_intensity: number | null
          relief_timing: string | null
          symptoms: string[] | null
          treatment: Json | null
          treatment_outcome: string | null
          treatment_timing: string | null
          triggers: string[] | null
          updated_at: string
          user_id: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          episode_id: string
          id?: string
          is_origin?: boolean
          location_name: string
          notes?: string | null
          pain_intensity?: number | null
          relief_timing?: string | null
          symptoms?: string[] | null
          treatment?: Json | null
          treatment_outcome?: string | null
          treatment_timing?: string | null
          triggers?: string[] | null
          updated_at?: string
          user_id: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          episode_id?: string
          id?: string
          is_origin?: boolean
          location_name?: string
          notes?: string | null
          pain_intensity?: number | null
          relief_timing?: string | null
          symptoms?: string[] | null
          treatment?: Json | null
          treatment_outcome?: string | null
          treatment_timing?: string | null
          triggers?: string[] | null
          updated_at?: string
          user_id?: string
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "episode_locations_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "headache_episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      headache_episodes: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string
          notes: string | null
          pain_intensity: number | null
          pain_location: string | null
          relief_timing: string | null
          start_time: string
          status: string
          symptoms: string[] | null
          treatment: Json | null
          treatment_outcome: string | null
          treatment_timing: string | null
          triggers: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          pain_intensity?: number | null
          pain_location?: string | null
          relief_timing?: string | null
          start_time?: string
          status: string
          symptoms?: string[] | null
          treatment?: Json | null
          treatment_outcome?: string | null
          treatment_timing?: string | null
          triggers?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          pain_intensity?: number | null
          pain_location?: string | null
          relief_timing?: string | null
          start_time?: string
          status?: string
          symptoms?: string[] | null
          treatment?: Json | null
          treatment_outcome?: string | null
          treatment_timing?: string | null
          triggers?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_tracker_connections: {
        Row: {
          access_token_encrypted: string | null
          created_at: string | null
          id: string
          is_connected: boolean | null
          last_sync_at: string | null
          provider: string
          refresh_token_encrypted: string | null
          scopes: string[] | null
          sync_enabled: boolean | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token_encrypted?: string | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          provider: string
          refresh_token_encrypted?: string | null
          scopes?: string[] | null
          sync_enabled?: boolean | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token_encrypted?: string | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          provider?: string
          refresh_token_encrypted?: string | null
          scopes?: string[] | null
          sync_enabled?: boolean | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      oauth_state_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          provider: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          provider: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          provider?: string
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          export_preferences: Json | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          export_preferences?: Json | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          export_preferences?: Json | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          endpoint: string
          id: string
          identifier: string
          window_end: string
          window_start: string
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          endpoint: string
          id?: string
          identifier: string
          window_end: string
          window_start: string
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          endpoint?: string
          id?: string
          identifier?: string
          window_end?: string
          window_start?: string
        }
        Relationships: []
      }
      test_events: {
        Row: {
          component: string | null
          created_at: string | null
          event_details: string | null
          event_type: string
          id: string
          metadata: Json | null
          session_id: string
          severity: string | null
          user_id: string | null
        }
        Insert: {
          component?: string | null
          created_at?: string | null
          event_details?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          session_id: string
          severity?: string | null
          user_id?: string | null
        }
        Update: {
          component?: string | null
          created_at?: string | null
          event_details?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          session_id?: string
          severity?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      unified_health_data: {
        Row: {
          bed_time: string | null
          created_at: string | null
          cycle_day: number | null
          data_type: string
          date: string
          id: string
          menstrual_phase: string | null
          period_flow: string | null
          raw_data: Json | null
          sleep_duration_minutes: number | null
          sleep_quality_score: number | null
          sleep_stages: Json | null
          source: string
          synced_at: string | null
          updated_at: string | null
          user_id: string
          wake_time: string | null
        }
        Insert: {
          bed_time?: string | null
          created_at?: string | null
          cycle_day?: number | null
          data_type: string
          date: string
          id?: string
          menstrual_phase?: string | null
          period_flow?: string | null
          raw_data?: Json | null
          sleep_duration_minutes?: number | null
          sleep_quality_score?: number | null
          sleep_stages?: Json | null
          source?: string
          synced_at?: string | null
          updated_at?: string | null
          user_id: string
          wake_time?: string | null
        }
        Update: {
          bed_time?: string | null
          created_at?: string | null
          cycle_day?: number | null
          data_type?: string
          date?: string
          id?: string
          menstrual_phase?: string | null
          period_flow?: string | null
          raw_data?: Json | null
          sleep_duration_minutes?: number | null
          sleep_quality_score?: number | null
          sleep_stages?: Json | null
          source?: string
          synced_at?: string | null
          updated_at?: string | null
          user_id?: string
          wake_time?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "beta_tester" | "user"
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
      app_role: ["admin", "beta_tester", "user"],
    },
  },
} as const
