import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Room {
  id: string;
  hostel_id: string;
  name: string;
  type: string;
  capacity: number;
  price: number;
  availability: number;
  amenities: string[];
  images: string[];
}

export const fetchRooms = (hostelId: string) =>
  supabase.from("rooms").select("*").eq("hostel_id", hostelId);

export const createRoom = (room: Omit<Room, "id">) =>
  supabase.from("rooms").insert([room]).select().single();

export const updateRoom = (id: string, updates: Partial<Room>) =>
  supabase.from("rooms").update(updates).eq("id", id).select().single();

export const deleteRoomById = (id: string) =>
  supabase.from("rooms").delete().eq("id", id);

