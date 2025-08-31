import { Database } from '@/database.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = "https://jcgyakjxfifdblibhljt.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZ3lha2p4ZmlmZGJsaWJobGp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTE2MjQsImV4cCI6MjA2NTM4NzYyNH0.TYsae2qMc6iq_B4dBp8yD1bcZXfDeW3IoHbfEy7sjDA";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
