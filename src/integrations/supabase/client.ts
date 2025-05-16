
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xpiiflvojrachlfoypcx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaWlmbHZvanJhY2hsZm95cGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzA4NjAsImV4cCI6MjA2MjkwNjg2MH0.ZRYqDAIt2Y8RGeKln5EEf_TGeJ06qZJ86CXlJdPGWHQ";

// Create the supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Simplified response type
export type PostgrestResponse<T> = {
  data: T | null;
  error: any;
};

// Define valid table names as a type
export type TableName = 'hostels' | 'rooms' | 'bookings' | 'profiles' | 'wishlist';

// Simplified query functions
export const query = <T = any>(tableName: TableName) => {
  return {
    select: (columns = '*') => {
      const builder = supabase.from(tableName).select(columns);
      
      return {
        eq: (column: string, value: any) => {
          const filtered = builder.eq(column, value);
          
          return {
            async single(): Promise<PostgrestResponse<T>> {
              try {
                const result = await filtered.single();
                return { 
                  data: result.data as T, 
                  error: result.error 
                };
              } catch (error) {
                return { data: null, error };
              }
            },
            
            async maybeSingle(): Promise<PostgrestResponse<T>> {
              try {
                const result = await filtered.maybeSingle();
                return { 
                  data: result.data as T, 
                  error: result.error 
                };
              } catch (error) {
                return { data: null, error };
              }
            },
            
            async execute(): Promise<PostgrestResponse<T[]>> {
              try {
                const result = await filtered;
                return { 
                  data: result.data as T[], 
                  error: result.error 
                };
              } catch (error) {
                return { data: null, error };
              }
            }
          };
        },
        
        async execute(): Promise<PostgrestResponse<T[]>> {
          try {
            const result = await builder;
            return { 
              data: result.data as T[], 
              error: result.error 
            };
          } catch (error) {
            return { data: null, error };
          }
        }
      };
    }
  };
};

export const mutate = <T = any>(tableName: TableName) => {
  return {
    update: (values: any) => {
      const builder = supabase.from(tableName).update(values);
      
      return {
        eq: (column: string, value: any) => {
          const filtered = builder.eq(column, value);
          
          return {
            eq: async (col2: string, val2: any): Promise<PostgrestResponse<T[]>> => {
              try {
                const result = await filtered.eq(col2, val2);
                return { 
                  data: result.data as T[], 
                  error: result.error 
                };
              } catch (error) {
                return { data: null, error };
              }
            },
            
            async execute(): Promise<PostgrestResponse<T[]>> {
              try {
                const result = await filtered;
                return { 
                  data: result.data as T[], 
                  error: result.error 
                };
              } catch (error) {
                return { data: null, error };
              }
            }
          };
        },
        
        async execute(): Promise<PostgrestResponse<T[]>> {
          try {
            const result = await builder;
            return { 
              data: result.data as T[], 
              error: result.error 
            };
          } catch (error) {
            return { data: null, error };
          }
        }
      };
    },
    
    insert: async (values: any): Promise<PostgrestResponse<T[]>> => {
      try {
        const result = await supabase.from(tableName).insert(values);
        return { 
          data: result.data as T[], 
          error: result.error 
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    
    delete: () => {
      const builder = supabase.from(tableName).delete();
      
      return {
        eq: async (column: string, value: any): Promise<PostgrestResponse<T[]>> => {
          try {
            const result = await builder.eq(column, value);
            return { 
              data: result.data as T[], 
              error: result.error 
            };
          } catch (error) {
            return { data: null, error };
          }
        },
        
        async execute(): Promise<PostgrestResponse<T[]>> {
          try {
            const result = await builder;
            return { 
              data: result.data as T[], 
              error: result.error 
            };
          } catch (error) {
            return { data: null, error };
          }
        }
      };
    }
  };
};

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
