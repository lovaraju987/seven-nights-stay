
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Hostel = Tables<'hostels'> & {
  rooms?: Tables<'rooms'>[];
  // Add properties that might not exist in the database but are used in the UI
  gender?: string;
  rating?: number;
  amenities?: Record<string, boolean>;
  map_url?: string;
  available_beds?: number;
  pricing_daily?: number;
  pricing_weekly?: number;
  pricing_monthly?: number;
};

export const useHostels = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hostels')
        .select(`
          *,
          rooms (*)
        `)
        .eq('status', 'verified'); // Changed from 'published' to 'verified'

      if (error) {
        console.error('Error fetching hostels:', error);
        setError(error.message);
      } else {
        console.log('Fetched hostels data:', data);
        setHostels(data || []);
      }
    } catch (error) {
      console.error('Error fetching hostels:', error);
      setError('Failed to fetch hostels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  return {
    hostels,
    loading,
    error,
    refetch: fetchHostels,
  };
};
