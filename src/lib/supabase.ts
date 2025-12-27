import { createClient } from '@supabase/supabase-js';

// Get and trim environment variables to avoid whitespace issues
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Authentication features will not work.');
  console.warn('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
}

// Validate URL format
let isValidUrl = false;
if (supabaseUrl) {
  try {
    const url = new URL(supabaseUrl);
    isValidUrl = url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    console.error('Invalid Supabase URL format:', supabaseUrl);
  }
}

export const supabase = (supabaseUrl && supabaseAnonKey && isValidUrl)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

