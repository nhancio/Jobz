-- ============================================
-- Jobz Application - Complete Database Schema
-- ============================================
-- Run this entire script in your Supabase SQL Editor
-- This creates all necessary tables, policies, and functions

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Stores user profiles (both job seekers and employers)

CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('seeker', 'employer')),
  
  -- Basic Information
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  
  -- Media
  avatar TEXT,
  logo TEXT,
  
  -- Job Seeker Fields
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  experience TEXT,
  education TEXT,
  
  -- Employer/Job Fields
  description TEXT,
  requirements TEXT[] DEFAULT '{}',
  salary TEXT,
  type TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_user_mode UNIQUE(user_id, mode)
);

-- ============================================
-- 2. MATCHES TABLE
-- ============================================
-- Stores matches between users (when they swipe right on each other)

CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seeker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Match status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'archived')),
  
  -- Messages/conversation (optional for future)
  last_message_at TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0,
  
  CONSTRAINT unique_match UNIQUE(seeker_id, employer_id, job_id, candidate_id)
);

-- ============================================
-- 3. SWIPES TABLE
-- ============================================
-- Tracks all swipe actions (left/right) for analytics and preventing duplicates

CREATE TABLE IF NOT EXISTS swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('left', 'right')),
  swiped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_swipe UNIQUE(user_id, target_profile_id)
);

-- ============================================
-- 4. USER_PREFERENCES TABLE
-- ============================================
-- Stores user preferences for job matching

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Job Seeker Preferences
  preferred_locations TEXT[],
  preferred_salary_min TEXT,
  preferred_salary_max TEXT,
  preferred_job_types TEXT[],
  preferred_industries TEXT[],
  
  -- Employer Preferences
  preferred_skills TEXT[],
  preferred_experience_level TEXT,
  preferred_education_level TEXT,
  
  -- General Preferences
  notification_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. INDEXES FOR PERFORMANCE
-- ============================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_mode ON profiles(user_id, mode);
CREATE INDEX IF NOT EXISTS idx_profiles_mode ON profiles(mode);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);

-- Matches indexes
CREATE INDEX IF NOT EXISTS idx_matches_seeker ON matches(seeker_id);
CREATE INDEX IF NOT EXISTS idx_matches_employer ON matches(employer_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_matched_at ON matches(matched_at DESC);

-- Swipes indexes
CREATE INDEX IF NOT EXISTS idx_swipes_user ON swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_target ON swipes(target_profile_id);
CREATE INDEX IF NOT EXISTS idx_swipes_user_target ON swipes(user_id, target_profile_id);

-- User preferences indexes
CREATE INDEX IF NOT EXISTS idx_preferences_user ON user_preferences(user_id);

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profiles
CREATE POLICY "Users can view their own profiles"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view other users' profiles (for matching)
CREATE POLICY "Users can view other profiles for matching"
  ON profiles FOR SELECT
  USING (true); -- Allow viewing all profiles for matching

-- Users can insert their own profiles
CREATE POLICY "Users can insert their own profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profiles
CREATE POLICY "Users can update their own profiles"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own profiles
CREATE POLICY "Users can delete their own profiles"
  ON profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- MATCHES POLICIES
-- ============================================

-- Users can view matches they're involved in
CREATE POLICY "Users can view their matches"
  ON matches FOR SELECT
  USING (auth.uid() = seeker_id OR auth.uid() = employer_id);

-- Users can create matches
CREATE POLICY "Users can create matches"
  ON matches FOR INSERT
  WITH CHECK (auth.uid() = seeker_id OR auth.uid() = employer_id);

-- Users can update their matches
CREATE POLICY "Users can update their matches"
  ON matches FOR UPDATE
  USING (auth.uid() = seeker_id OR auth.uid() = employer_id)
  WITH CHECK (auth.uid() = seeker_id OR auth.uid() = employer_id);

-- ============================================
-- SWIPES POLICIES
-- ============================================

-- Users can view their own swipes
CREATE POLICY "Users can view their own swipes"
  ON swipes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own swipes
CREATE POLICY "Users can create their own swipes"
  ON swipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own swipes
CREATE POLICY "Users can delete their own swipes"
  ON swipes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- USER_PREFERENCES POLICIES
-- ============================================

-- Users can view their own preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own preferences
CREATE POLICY "Users can delete their own preferences"
  ON user_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 7. FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_preferences table
CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. HELPER FUNCTIONS
-- ============================================

-- Function to get user's profile by mode
CREATE OR REPLACE FUNCTION get_user_profile(p_user_id UUID, p_mode TEXT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  mode TEXT,
  name TEXT,
  title TEXT,
  location TEXT,
  avatar TEXT,
  logo TEXT,
  bio TEXT,
  skills TEXT[],
  experience TEXT,
  education TEXT,
  description TEXT,
  requirements TEXT[],
  salary TEXT,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM profiles
  WHERE profiles.user_id = p_user_id
    AND profiles.mode = p_mode;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if users have matched
CREATE OR REPLACE FUNCTION check_match(
  p_seeker_id UUID,
  p_employer_id UUID,
  p_job_id UUID,
  p_candidate_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  match_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM matches
    WHERE seeker_id = p_seeker_id
      AND employer_id = p_employer_id
      AND job_id = p_job_id
      AND candidate_id = p_candidate_id
      AND status = 'accepted'
  ) INTO match_exists;
  
  RETURN match_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================
-- Uncomment to insert sample data for testing

/*
-- Note: Replace 'sample-user-id' with actual user IDs from auth.users
INSERT INTO profiles (user_id, mode, name, title, location, bio, skills)
VALUES 
  ('sample-user-id-1', 'seeker', 'John Doe', 'Software Engineer', 'San Francisco, CA', 
   'Experienced full-stack developer', ARRAY['React', 'Node.js', 'TypeScript']),
  ('sample-user-id-2', 'employer', 'Tech Corp', 'Senior Developer', 'New York, NY',
   'Looking for talented developers', ARRAY['5+ years experience', 'React', 'Node.js']);
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything was created correctly

-- Check tables
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name IN ('profiles', 'matches', 'swipes', 'user_preferences');

-- Check policies
-- SELECT tablename, policyname FROM pg_policies 
-- WHERE schemaname = 'public';

-- Check indexes
-- SELECT indexname, tablename FROM pg_indexes 
-- WHERE schemaname = 'public' AND tablename IN ('profiles', 'matches', 'swipes', 'user_preferences');

-- ============================================
-- COMPLETE!
-- ============================================
-- Your database is now ready to use!
-- 
-- Next steps:
-- 1. Configure LinkedIn OAuth in Supabase Authentication
-- 2. Set up environment variables in your app
-- 3. Test user registration and profile creation

