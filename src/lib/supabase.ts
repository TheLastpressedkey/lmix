import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://tppldbgypnxybwcqyoyd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcGxkYmd5cG54eWJ3Y3F5b3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MjQwMjUsImV4cCI6MjA1ODAwMDAyNX0.AveYYilJOBxG-6iq6ljLoTYoQu13x2VUgJI2PvlvmN0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);