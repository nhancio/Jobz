import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithLinkedIn: () => Promise<void>;
  signInDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchLinkedInProfile: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithLinkedIn = async () => {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin',
      options: {
        redirectTo: window.location.origin,
        scopes: 'r_liteprofile r_emailaddress', // Request LinkedIn profile and email
      },
    });

    if (error) {
      throw error;
    }
  };

  const signInDemo = async () => {
    // Create a demo user session without actual authentication
    // This allows testing the app without LinkedIn OAuth setup
    const demoUser = {
      id: 'demo-user-' + Date.now(),
      email: 'demo@jobz.app',
      user_metadata: {
        full_name: 'Demo User',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
      },
    } as User;

    const demoSession = {
      access_token: 'demo-token',
      token_type: 'bearer',
      user: demoUser,
    } as Session;

    setSession(demoSession);
    setUser(demoUser);
    setLoading(false);
  };

  const fetchLinkedInProfile = async () => {
    if (!supabase || !session) {
      throw new Error('Not authenticated');
    }

    try {
      // Get user metadata which contains LinkedIn profile info
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not found');
      }

      // LinkedIn profile data is typically in user.user_metadata
      const linkedInData = {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || user.user_metadata?.name,
        avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        linkedInId: user.user_metadata?.sub || user.user_metadata?.provider_id,
        headline: user.user_metadata?.headline,
        location: user.user_metadata?.location?.name,
        profileUrl: user.user_metadata?.profile_url,
        // Additional LinkedIn fields that might be available
        raw: user.user_metadata,
      };

      return linkedInData;
    } catch (error: any) {
      console.error('Error fetching LinkedIn profile:', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!supabase) {
      // For demo mode, just clear local state
      setSession(null);
      setUser(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithLinkedIn, signInDemo, signOut, fetchLinkedInProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

