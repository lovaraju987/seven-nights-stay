
// Custom types for our database schema
export type Profile = {
  id: string;
  name: string;
  phone: string;
  role: 'hosteller' | 'owner' | 'admin' | 'agent';
  emergency_contact?: string;
  id_verified: boolean;
  id_document_url?: string;
  created_at: string;
};

export type Hostel = {
  id: string;
  name: string;
  type: 'boys' | 'girls' | 'coed';
  description: string;
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  lat?: number;
  lng?: number;
  owner_id?: string;
  agent_id?: string;
  status: 'draft' | 'pending' | 'verified' | 'blocked';
  images?: string[];
  video_url?: string;
  storefront_url?: string;
  qr_code_url?: string;
  created_by: 'owner' | 'agent';
  created_at: string;
};

export type Room = {
  id: string;
  hostel_id: string;
  room_name: string;
  type: 'single' | 'double' | 'triple' | 'quad';
  ac: boolean;
  beds_total: number;
  beds_available: number;
  pricing_daily?: number;
  pricing_weekly?: number;
  pricing_monthly?: number;
  deposit?: number;
  status: 'active' | 'maintenance';
  images?: string[];
  created_at: string;
};

export type Booking = {
  id: string;
  hosteller_id: string;
  hostel_id: string;
  room_id: string;
  plan: 'daily' | 'weekly' | 'monthly';
  start_date: string;
  end_date: string;
  guest_name?: string;
  guest_id_url?: string;
  amount: number;
  payment_status: 'paid' | 'cash';
  status: 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
};

// Join types for fetching related data
export type BookingWithDetails = Booking & {
  hostels?: Hostel;
  rooms?: Room;
};
