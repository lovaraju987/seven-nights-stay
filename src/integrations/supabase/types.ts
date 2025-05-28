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
      agent_tasks: {
        Row: {
          agent_id: string | null
          completed_date: string | null
          due_date: string
          hostel_id: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
        }
        Insert: {
          agent_id?: string | null
          completed_date?: string | null
          due_date: string
          hostel_id?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
        }
        Update: {
          agent_id?: string | null
          completed_date?: string | null
          due_date?: string
          hostel_id?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_tasks_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          amount: number
          created_at: string | null
          end_date: string
          guest_id_url: string | null
          guest_name: string | null
          hostel_id: string
          hosteller_id: string
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          plan: Database["public"]["Enums"]["booking_plan"]
          room_id: string
          start_date: string
          status: Database["public"]["Enums"]["booking_status"]
        }
        Insert: {
          amount: number
          created_at?: string | null
          end_date: string
          guest_id_url?: string | null
          guest_name?: string | null
          hostel_id: string
          hosteller_id: string
          id?: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          plan: Database["public"]["Enums"]["booking_plan"]
          room_id: string
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"]
        }
        Update: {
          amount?: number
          created_at?: string | null
          end_date?: string
          guest_id_url?: string | null
          guest_name?: string | null
          hostel_id?: string
          hosteller_id?: string
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          plan?: Database["public"]["Enums"]["booking_plan"]
          room_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"]
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
            foreignKeyName: "bookings_hosteller_id_fkey"
            columns: ["hosteller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      complaints: {
        Row: {
          assigned_agent: string | null
          booking_id: string | null
          created_at: string | null
          description: string
          hostel_id: string
          id: string
          status: Database["public"]["Enums"]["complaint_status"]
          type: string
          user_id: string
        }
        Insert: {
          assigned_agent?: string | null
          booking_id?: string | null
          created_at?: string | null
          description: string
          hostel_id: string
          id?: string
          status?: Database["public"]["Enums"]["complaint_status"]
          type: string
          user_id: string
        }
        Update: {
          assigned_agent?: string | null
          booking_id?: string | null
          created_at?: string | null
          description?: string
          hostel_id?: string
          id?: string
          status?: Database["public"]["Enums"]["complaint_status"]
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_assigned_agent_fkey"
            columns: ["assigned_agent"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostels: {
        Row: {
          address: Json
          agent_id: string | null
          created_at: string | null
          created_by: Database["public"]["Enums"]["hostel_created_by"]
          description: string
          id: string
          images: string[] | null
          lat: number | null
          lng: number | null
          name: string
          owner_id: string | null
          owner_name: string | null
          owner_phone: string | null
          qr_code_url: string | null
          status: Database["public"]["Enums"]["hostel_status"]
          storefront_url: string | null
          type: Database["public"]["Enums"]["hostel_type"]
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          address: Json
          agent_id?: string | null
          created_at?: string | null
          created_by: Database["public"]["Enums"]["hostel_created_by"]
          description: string
          id?: string
          images?: string[] | null
          lat?: number | null
          lng?: number | null
          name: string
          owner_id?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          qr_code_url?: string | null
          status?: Database["public"]["Enums"]["hostel_status"]
          storefront_url?: string | null
          type: Database["public"]["Enums"]["hostel_type"]
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          address?: Json
          agent_id?: string | null
          created_at?: string | null
          created_by?: Database["public"]["Enums"]["hostel_created_by"]
          description?: string
          id?: string
          images?: string[] | null
          lat?: number | null
          lng?: number | null
          name?: string
          owner_id?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          qr_code_url?: string | null
          status?: Database["public"]["Enums"]["hostel_status"]
          storefront_url?: string | null
          type?: Database["public"]["Enums"]["hostel_type"]
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hostels_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostels_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          hostel_id: string | null
          id: string
          status: Database["public"]["Enums"]["payment_transaction_status"]
          timestamp: string | null
          type: Database["public"]["Enums"]["payment_type"]
          user_id: string
        }
        Insert: {
          amount: number
          hostel_id?: string | null
          id?: string
          status: Database["public"]["Enums"]["payment_transaction_status"]
          timestamp?: string | null
          type: Database["public"]["Enums"]["payment_type"]
          user_id: string
        }
        Update: {
          amount?: number
          hostel_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["payment_transaction_status"]
          timestamp?: string | null
          type?: Database["public"]["Enums"]["payment_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          emergency_contact: string | null
          id: string
          id_document_url: string | null
          id_verified: boolean | null
          is_verified: boolean | null
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          emergency_contact?: string | null
          id: string
          id_document_url?: string | null
          id_verified?: boolean | null
          is_verified?: boolean | null
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          emergency_contact?: string | null
          id?: string
          id_document_url?: string | null
          id_verified?: boolean | null
          is_verified?: boolean | null
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      rooms: {
        Row: {
          ac: boolean | null
          beds_available: number
          beds_total: number
          created_at: string | null
          deposit: number | null
          hostel_id: string
          id: string
          images: string[] | null
          pricing_daily: number | null
          pricing_monthly: number | null
          pricing_weekly: number | null
          room_name: string
          status: Database["public"]["Enums"]["room_status"] | null
          type: Database["public"]["Enums"]["room_type"]
        }
        Insert: {
          ac?: boolean | null
          beds_available: number
          beds_total: number
          created_at?: string | null
          deposit?: number | null
          hostel_id: string
          id?: string
          images?: string[] | null
          pricing_daily?: number | null
          pricing_monthly?: number | null
          pricing_weekly?: number | null
          room_name: string
          status?: Database["public"]["Enums"]["room_status"] | null
          type: Database["public"]["Enums"]["room_type"]
        }
        Update: {
          ac?: boolean | null
          beds_available?: number
          beds_total?: number
          created_at?: string | null
          deposit?: number | null
          hostel_id?: string
          id?: string
          images?: string[] | null
          pricing_daily?: number | null
          pricing_monthly?: number | null
          pricing_weekly?: number | null
          room_name?: string
          status?: Database["public"]["Enums"]["room_status"] | null
          type?: Database["public"]["Enums"]["room_type"]
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
      subscriptions: {
        Row: {
          amount: number
          created_at: string | null
          expires_on: string
          features: string[] | null
          grace_ends_on: string
          hostel_id: string | null
          id: string
          owner_id: string | null
          plan_name: string
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          status: Database["public"]["Enums"]["subscription_status"]
        }
        Insert: {
          amount: number
          created_at?: string | null
          expires_on: string
          features?: string[] | null
          grace_ends_on: string
          hostel_id?: string | null
          id?: string
          owner_id?: string | null
          plan_name: string
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          status: Database["public"]["Enums"]["subscription_status"]
        }
        Update: {
          amount?: number
          created_at?: string | null
          expires_on?: string
          features?: string[] | null
          grace_ends_on?: string
          hostel_id?: string | null
          id?: string
          owner_id?: string | null
          plan_name?: string
          plan_type?: Database["public"]["Enums"]["subscription_plan_type"]
          status?: Database["public"]["Enums"]["subscription_status"]
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      booking_plan: "daily" | "weekly" | "monthly"
      booking_status: "confirmed" | "cancelled" | "completed"
      complaint_status: "open" | "resolved" | "escalated"
      hostel_created_by: "owner" | "agent"
      hostel_status: "draft" | "pending" | "verified" | "blocked"
      hostel_type: "boys" | "girls" | "coed"
      payment_status: "paid" | "cash"
      payment_transaction_status: "success" | "failed"
      payment_type: "booking" | "subscription"
      room_status: "active" | "maintenance"
      room_type: "single" | "double" | "triple" | "quad"
      subscription_plan_type: "fixed" | "commission"
      subscription_status: "active" | "expired"
      user_role: "hosteller" | "owner" | "admin" | "agent"
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
    Enums: {
      booking_plan: ["daily", "weekly", "monthly"],
      booking_status: ["confirmed", "cancelled", "completed"],
      complaint_status: ["open", "resolved", "escalated"],
      hostel_created_by: ["owner", "agent"],
      hostel_status: ["draft", "pending", "verified", "blocked"],
      hostel_type: ["boys", "girls", "coed"],
      payment_status: ["paid", "cash"],
      payment_transaction_status: ["success", "failed"],
      payment_type: ["booking", "subscription"],
      room_status: ["active", "maintenance"],
      room_type: ["single", "double", "triple", "quad"],
      subscription_plan_type: ["fixed", "commission"],
      subscription_status: ["active", "expired"],
      user_role: ["hosteller", "owner", "admin", "agent"],
    },
  },
} as const
