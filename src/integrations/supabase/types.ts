export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          amount: number
          created_at: string | null
          end_date: string
          guest_id_url: string | null
          guest_name: string | null
          hostel_id: string | null
          hosteller_id: string | null
          id: string
          payment_status: string | null
          plan: string | null
          room_id: string | null
          start_date: string
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          end_date: string
          guest_id_url?: string | null
          guest_name?: string | null
          hostel_id?: string | null
          hosteller_id?: string | null
          id?: string
          payment_status?: string | null
          plan?: string | null
          room_id?: string | null
          start_date: string
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          end_date?: string
          guest_id_url?: string | null
          guest_name?: string | null
          hostel_id?: string | null
          hosteller_id?: string | null
          id?: string
          payment_status?: string | null
          plan?: string | null
          room_id?: string | null
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      hostels: {
        Row: {
          address: Json | null
          agent_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          images: string[] | null
          lat: number | null
          lng: number | null
          name: string
          owner_id: string | null
          qr_code_url: string | null
          status: string | null
          storefront_url: string | null
          type: string | null
          video_url: string | null
        }
        Insert: {
          address?: Json | null
          agent_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          lat?: number | null
          lng?: number | null
          name: string
          owner_id?: string | null
          qr_code_url?: string | null
          status?: string | null
          storefront_url?: string | null
          type?: string | null
          video_url?: string | null
        }
        Update: {
          address?: Json | null
          agent_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          lat?: number | null
          lng?: number | null
          name?: string
          owner_id?: string | null
          qr_code_url?: string | null
          status?: string | null
          storefront_url?: string | null
          type?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          emergency_contact: string | null
          id: string
          id_document_url: string | null
          id_verified: boolean | null
          name: string | null
          phone: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          emergency_contact?: string | null
          id: string
          id_document_url?: string | null
          id_verified?: boolean | null
          name?: string | null
          phone?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          emergency_contact?: string | null
          id?: string
          id_document_url?: string | null
          id_verified?: boolean | null
          name?: string | null
          phone?: string | null
          role?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          ac: boolean | null
          beds_available: number | null
          beds_total: number | null
          created_at: string | null
          deposit: number | null
          hostel_id: string | null
          id: string
          images: string[] | null
          pricing_daily: number | null
          pricing_monthly: number | null
          pricing_weekly: number | null
          room_name: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          ac?: boolean | null
          beds_available?: number | null
          beds_total?: number | null
          created_at?: string | null
          deposit?: number | null
          hostel_id?: string | null
          id?: string
          images?: string[] | null
          pricing_daily?: number | null
          pricing_monthly?: number | null
          pricing_weekly?: number | null
          room_name?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          ac?: boolean | null
          beds_available?: number | null
          beds_total?: number | null
          created_at?: string | null
          deposit?: number | null
          hostel_id?: string | null
          id?: string
          images?: string[] | null
          pricing_daily?: number | null
          pricing_monthly?: number | null
          pricing_weekly?: number | null
          room_name?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist: {
        Row: {
          created_at: string | null
          hostel_id: string | null
          hosteller_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          hostel_id?: string | null
          hosteller_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          hostel_id?: string | null
          hosteller_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
