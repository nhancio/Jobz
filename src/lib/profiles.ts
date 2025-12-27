import { supabase } from './supabase';

export interface ProfileData {
  id?: string;
  user_id?: string;
  mode: 'seeker' | 'employer';
  name: string;
  title: string;
  location: string;
  avatar?: string;
  logo?: string;
  bio?: string;
  description?: string;
  skills?: string[];
  requirements?: string[];
  experience?: string;
  education?: string;
  salary?: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Save a profile to the database
 */
export async function saveProfile(data: ProfileData): Promise<ProfileData> {
  if (!supabase) {
    // Fallback: return data with mock ID if Supabase is not configured
    console.warn('Supabase is not configured. Profile will not be saved to database.');
    return {
      ...data,
      id: `mock-${Date.now()}`,
      user_id: 'mock-user',
    };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if profile already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('mode', data.mode)
      .single();

    let result;
    if (existing) {
      // Update existing profile
      const { data: updated, error } = await supabase
        .from('profiles')
        .update({
          ...data,
          user_id: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = updated;
    } else {
      // Create new profile
      const { data: created, error } = await supabase
        .from('profiles')
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      result = created;
    }

    return result as ProfileData;
  } catch (error: any) {
    console.error('Error saving profile:', error);
    throw error;
  }
}

/**
 * Get a user's profile
 */
export async function getProfile(mode: 'seeker' | 'employer'): Promise<ProfileData | null> {
  if (!supabase) {
    console.warn('Supabase is not configured. Cannot load profile.');
    return null;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('mode', mode)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return null;
      }
      throw error;
    }

    return data as ProfileData;
  } catch (error: any) {
    console.error('Error loading profile:', error);
    return null;
  }
}

