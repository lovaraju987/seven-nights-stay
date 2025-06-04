
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Hostel = Tables<'hostels'> & {
  rooms?: Tables<'rooms'>[];
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
        .eq('status', 'published');

      if (error) {
        console.error('Error fetching hostels:', error);
        setError(error.message);
      } else {
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
