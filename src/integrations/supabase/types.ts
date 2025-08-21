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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      auction_settings: {
        Row: {
          bid_direction: string
          created_at: string
          dynamic_close_period: string
          event_id: string
          event_type: string
          id: string
          maximum_bid_change: number
          minimum_bid_change: number
          minimum_duration: number
          start_date: string | null
          start_time: string | null
          tied_bid_option: string
          updated_at: string
        }
        Insert: {
          bid_direction?: string
          created_at?: string
          dynamic_close_period?: string
          event_id: string
          event_type?: string
          id?: string
          maximum_bid_change?: number
          minimum_bid_change?: number
          minimum_duration?: number
          start_date?: string | null
          start_time?: string | null
          tied_bid_option?: string
          updated_at?: string
        }
        Update: {
          bid_direction?: string
          created_at?: string
          dynamic_close_period?: string
          event_id?: string
          event_type?: string
          id?: string
          maximum_bid_change?: number
          minimum_bid_change?: number
          minimum_duration?: number
          start_date?: string | null
          start_time?: string | null
          tied_bid_option?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_settings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          created_at: string
          event_id: string
          id: string
          lot_id: string
          participant_id: string
          price_per_unit: number
          status: string
          total_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          lot_id: string
          participant_id: string
          price_per_unit: number
          status?: string
          total_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          lot_id?: string
          participant_id?: string
          price_per_unit?: number
          status?: string
          total_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          event_id: string
          file_path: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          name: string
          shared_with_all: boolean
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          event_id: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name: string
          shared_with_all?: boolean
          updated_at?: string
          version?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          shared_with_all?: boolean
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_messages: {
        Row: {
          content: string
          created_at: string
          event_id: string
          id: string
          is_from_host: boolean
          is_read: boolean
          recipient_id: string | null
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string
          event_id: string
          id?: string
          is_from_host?: boolean
          is_read?: boolean
          recipient_id?: string | null
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          event_id?: string
          id?: string
          is_from_host?: boolean
          is_read?: boolean
          recipient_id?: string | null
          sender_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          approved: boolean
          auto_accept: boolean
          event_id: string
          id: string
          invited_at: string
          lots_entered: number
          participant_id: string
          questionnaires_completed: number
          status: string
        }
        Insert: {
          approved?: boolean
          auto_accept?: boolean
          event_id: string
          id?: string
          invited_at?: string
          lots_entered?: number
          participant_id: string
          questionnaires_completed?: number
          status?: string
        }
        Update: {
          approved?: boolean
          auto_accept?: boolean
          event_id?: string
          id?: string
          invited_at?: string
          lots_entered?: number
          participant_id?: string
          questionnaires_completed?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          brief_text: string | null
          category: string | null
          created_at: string
          currency: string
          default_currency: string
          description: string | null
          id: string
          include_auction: boolean
          include_questionnaire: boolean
          include_rfq: boolean
          multi_currency: boolean
          name: string
          seal_results: boolean
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brief_text?: string | null
          category?: string | null
          created_at?: string
          currency?: string
          default_currency?: string
          description?: string | null
          id?: string
          include_auction?: boolean
          include_questionnaire?: boolean
          include_rfq?: boolean
          multi_currency?: boolean
          name: string
          seal_results?: boolean
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brief_text?: string | null
          category?: string | null
          created_at?: string
          currency?: string
          default_currency?: string
          description?: string | null
          id?: string
          include_auction?: boolean
          include_questionnaire?: boolean
          include_rfq?: boolean
          multi_currency?: boolean
          name?: string
          seal_results?: boolean
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lots: {
        Row: {
          created_at: string
          current_price: number | null
          current_value: number | null
          event_id: string
          id: string
          name: string
          qualification_price: number | null
          qualification_value: number | null
          quantity: number
          unit_of_measure: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_price?: number | null
          current_value?: number | null
          event_id: string
          id?: string
          name: string
          qualification_price?: number | null
          qualification_value?: number | null
          quantity?: number
          unit_of_measure?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_price?: number | null
          current_value?: number | null
          event_id?: string
          id?: string
          name?: string
          qualification_price?: number | null
          qualification_value?: number | null
          quantity?: number
          unit_of_measure?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lots_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      questionnaires: {
        Row: {
          created_at: string
          deadline: string | null
          event_id: string
          id: string
          name: string
          order_index: number
          pre_qualification: boolean
          scoring: boolean
          updated_at: string
          weighting: boolean
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          event_id: string
          id?: string
          name: string
          order_index?: number
          pre_qualification?: boolean
          scoring?: boolean
          updated_at?: string
          weighting?: boolean
        }
        Update: {
          created_at?: string
          deadline?: string | null
          event_id?: string
          id?: string
          name?: string
          order_index?: number
          pre_qualification?: boolean
          scoring?: boolean
          updated_at?: string
          weighting?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "questionnaires_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      terms_responses: {
        Row: {
          created_at: string
          event_id: string
          id: string
          participant_id: string
          questionnaire_id: string
          responses: Json
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          participant_id: string
          questionnaire_id: string
          responses?: Json
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          participant_id?: string
          questionnaire_id?: string
          responses?: Json
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
