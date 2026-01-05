import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Only use AsyncStorage on client-side (not during SSR)
const isClient = typeof window !== 'undefined';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isClient ? AsyncStorage : undefined,
    autoRefreshToken: isClient,
    persistSession: isClient,
    detectSessionInUrl: false,
  },
});

// Database Types
export type User = {
  id: string;
  display_name: string;
  dietary_tags: string[];
  created_at: string;
};

export type Group = {
  id: string;
  zip_code: string;
  radius: number;
  price_tier: number;
  created_at: string;
  expires_at: string;
  status: 'waiting' | 'swiping' | 'matched' | 'expired';
};

export type GroupMember = {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
};

export type Swipe = {
  id: string;
  group_id: string;
  user_id: string;
  restaurant_id: string;
  is_liked: boolean;
  is_super_like: boolean;
  swiped_at: string;
};

export type Match = {
  id: string;
  group_id: string;
  restaurant_id: string;
  restaurant_data: any;
  matched_at: string;
  is_unanimous: boolean;
};
