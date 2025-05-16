
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xpiiflvojrachlfoypcx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaWlmbHZvanJhY2hsZm95cGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzA4NjAsImV4cCI6MjA2MjkwNjg2MH0.ZRYqDAIt2Y8RGeKln5EEf_TGeJ06qZJ86CXlJdPGWHQ";

// Create the supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper types for better type inference in components
export type PostgrestResponse<T> = {
  data: T | null;
  error: any;
};

// Define valid table names as a type
export type TableName = 'hostels' | 'rooms' | 'bookings' | 'profiles' | 'wishlist';

// Type-safe wrapper functions - simplified to avoid excessive type instantiation
export function query<T = any>(tableName: TableName) {
  return {
    select: (columns = '*') => {
      const builder = supabase.from(tableName).select(columns);
      return {
        eq: (column: string, value: any) => ({
          single: async (): Promise<PostgrestResponse<T>> => {
            return await builder.eq(column, value).single();
          },
          maybeSingle: async (): Promise<PostgrestResponse<T>> => {
            return await builder.eq(column, value).maybeSingle();
          },
          execute: async (): Promise<PostgrestResponse<T[]>> => {
            return await builder.eq(column, value);
          },
        }),
        execute: async (): Promise<PostgrestResponse<T[]>> => {
          return await builder;
        },
      };
    },
  };
}

export function mutate<T = any>(tableName: TableName) {
  return {
    update: (values: any) => {
      const builder = supabase.from(tableName).update(values);
      return {
        eq: (column: string, value: any) => ({
          eq: async (col2: string, val2: any): Promise<PostgrestResponse<T[]>> => {
            return await builder.eq(column, value).eq(col2, val2);
          },
          execute: async (): Promise<PostgrestResponse<T[]>> => {
            return await builder.eq(column, value);
          },
        }),
        execute: async (): Promise<PostgrestResponse<T[]>> => {
          return await builder;
        },
      };
    },
    insert: async (values: any): Promise<PostgrestResponse<T[]>> => {
      return await supabase.from(tableName).insert(values);
    },
    delete: () => {
      const builder = supabase.from(tableName).delete();
      return {
        eq: async (column: string, value: any): Promise<PostgrestResponse<T[]>> => {
          return await builder.eq(column, value);
        },
        execute: async (): Promise<PostgrestResponse<T[]>> => {
          return await builder;
        },
      };
    },
  };
}

// Auth helpers
export const authHelpers = {
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  signUp: async (email: string, password: string, userData?: { [key: string]: any }) => {
    return await supabase.auth.signUp({ 
      email, 
      password, 
      options: { data: userData } 
    });
  },
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  getUser: async () => {
    return await supabase.auth.getUser();
  },
  getSession: async () => {
    return await supabase.auth.getSession();
  },
  onAuthChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Storage helpers
export const storageHelpers = {
  uploadFile: async (bucket: string, path: string, file: File) => {
    return await supabase.storage.from(bucket).upload(path, file);
  },
  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage.from(bucket).getPublicUrl(path);
  },
  deleteFile: async (bucket: string, path: string) => {
    return await supabase.storage.from(bucket).remove([path]);
  }
};
