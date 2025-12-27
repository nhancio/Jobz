import { supabase } from './supabase';
import { Job, Candidate } from '../data/mockData';
import { ProfileData } from './profiles';

/**
 * Fetch all jobs (employer profiles) from Supabase
 */
export async function fetchJobs(): Promise<Job[]> {
  if (!supabase) {
    console.warn('Supabase is not configured. Cannot fetch jobs.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('mode', 'employer')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No jobs found in database.');
      return [];
    }

    // Map ProfileData to Job format
    return data.map((profile: ProfileData) => ({
      id: profile.id || '',
      title: profile.title,
      company: profile.name, // name is the company name for employer mode
      logo: profile.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&q=80',
      location: profile.location,
      salary: profile.salary || 'Not specified',
      type: profile.type || 'Full-time',
      description: profile.description || 'No description available.',
      requirements: profile.requirements || [],
      postedAt: profile.created_at 
        ? getTimeAgo(new Date(profile.created_at))
        : 'Recently',
    }));
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

/**
 * Fetch all candidates (seeker profiles) from Supabase
 */
export async function fetchCandidates(): Promise<Candidate[]> {
  if (!supabase) {
    console.warn('Supabase is not configured. Cannot fetch candidates.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('mode', 'seeker')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching candidates:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No candidates found in database.');
      return [];
    }

    // Map ProfileData to Candidate format
    return data.map((profile: ProfileData) => ({
      id: profile.id || '',
      name: profile.name,
      title: profile.title,
      experience: profile.experience || 'Not specified',
      avatar: profile.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
      bio: profile.bio || 'No bio available.',
      skills: profile.skills || [],
      location: profile.location,
      education: profile.education || 'Not specified',
    }));
  } catch (error: any) {
    console.error('Error fetching candidates:', error);
    return [];
  }
}

/**
 * Helper function to calculate time ago
 */
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
}

