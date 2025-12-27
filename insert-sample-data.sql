-- ============================================
-- Insert Sample Jobs and Candidates Data
-- ============================================
-- Run this in Supabase SQL Editor after running the schema
-- This will insert sample job postings and candidate profiles

-- ============================================
-- STEP 1: Create Test Users (if they don't exist)
-- ============================================
-- Note: In production, users are created via OAuth
-- For sample data, we'll use a function to create test users

-- Function to get or create a test user
CREATE OR REPLACE FUNCTION get_or_create_test_user(
  p_email TEXT,
  p_name TEXT
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Try to find existing user
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email
  LIMIT 1;
  
  -- If user doesn't exist, create one
  -- Note: This requires admin privileges
  IF v_user_id IS NULL THEN
    -- Insert into auth.users (requires admin)
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      p_email,
      crypt('test-password', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', p_name),
      NOW(),
      NOW(),
      '',
      ''
    )
    RETURNING id INTO v_user_id;
  END IF;
  
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 2: Insert Sample Jobs (Employer Mode)
-- ============================================

-- Get or create test employer users
DO $$
DECLARE
  employer1_id UUID;
  employer2_id UUID;
  employer3_id UUID;
  employer4_id UUID;
BEGIN
  -- Create test employer users
  employer1_id := get_or_create_test_user('techflow@example.com', 'TechFlow');
  employer2_id := get_or_create_test_user('creativestudio@example.com', 'Creative Studio');
  employer3_id := get_or_create_test_user('datacorp@example.com', 'DataCorp');
  employer4_id := get_or_create_test_user('growthio@example.com', 'Growth.io');

  -- Insert sample jobs
  INSERT INTO profiles (
    user_id,
    mode,
    name,
    title,
    location,
    logo,
    description,
    requirements,
    salary,
    type
  ) VALUES
  (
    employer1_id,
    'employer',
    'TechFlow',
    'Senior Frontend Engineer',
    'San Francisco, CA (Hybrid)',
    'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop&q=80',
    'We are looking for an experienced Frontend Engineer to lead our core product team. You will be working with React, TypeScript, and Tailwind CSS to build scalable and maintainable user interfaces. The ideal candidate will have a strong background in modern frontend development and a passion for creating exceptional user experiences.',
    ARRAY['5+ years React', 'TypeScript', 'System Design', 'Tailwind CSS', 'Team Leadership'],
    '$140k - $180k',
    'Full-time'
  ),
  (
    employer2_id,
    'employer',
    'Creative Studio',
    'Product Designer',
    'Remote',
    'https://images.unsplash.com/photo-1572044162444-ad6021194360?w=100&h=100&fit=crop&q=80',
    'Join our award-winning design team. We value creativity, pixel-perfection, and user-centric design approaches. You will work on exciting projects for top-tier clients, creating beautiful and functional designs that make a real impact.',
    ARRAY['Figma', 'Prototyping', 'Design Systems', 'User Research', 'UI/UX Design'],
    '$110k - $150k',
    'Contract'
  ),
  (
    employer3_id,
    'employer',
    'DataCorp',
    'Backend Developer',
    'New York, NY',
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&q=80',
    'Scale our distributed systems to handle millions of requests. Experience with Go and Kubernetes is a must. You will work on high-performance backend services, optimize database queries, and ensure system reliability and scalability.',
    ARRAY['Go', 'Kubernetes', 'PostgreSQL', 'Microservices', 'System Architecture'],
    '$150k - $190k',
    'Full-time'
  ),
  (
    employer4_id,
    'employer',
    'Growth.io',
    'Marketing Manager',
    'Austin, TX',
    'https://images.unsplash.com/photo-1599305445671-ac291c95dd0f?w=100&h=100&fit=crop&q=80',
    'Lead our growth initiatives and marketing campaigns. You will work closely with the sales team to drive revenue. This role requires a data-driven approach to marketing, with expertise in digital marketing channels and analytics.',
    ARRAY['B2B Marketing', 'SEO/SEM', 'Analytics', 'Content Strategy', 'Campaign Management'],
    '$90k - $120k',
    'Full-time'
  )
  ON CONFLICT (user_id, mode) DO NOTHING;
END $$;

-- ============================================
-- STEP 3: Insert Sample Candidates (Seeker Mode)
-- ============================================

DO $$
DECLARE
  candidate1_id UUID;
  candidate2_id UUID;
  candidate3_id UUID;
  candidate4_id UUID;
BEGIN
  -- Create test candidate users
  candidate1_id := get_or_create_test_user('sarah.chen@example.com', 'Sarah Chen');
  candidate2_id := get_or_create_test_user('marcus.johnson@example.com', 'Marcus Johnson');
  candidate3_id := get_or_create_test_user('emily.davis@example.com', 'Emily Davis');
  candidate4_id := get_or_create_test_user('david.kim@example.com', 'David Kim');

  -- Insert sample candidates
  INSERT INTO profiles (
    user_id,
    mode,
    name,
    title,
    location,
    avatar,
    bio,
    skills,
    experience,
    education
  ) VALUES
  (
    candidate1_id,
    'seeker',
    'Sarah Chen',
    'Senior Product Designer',
    'San Francisco, CA',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80',
    'Passionate about creating intuitive and beautiful user experiences. I specialize in complex design systems and accessibility. With over 6 years of experience, I have worked with startups and Fortune 500 companies to create products that users love.',
    ARRAY['Figma', 'React', 'UI/UX', 'Prototyping', 'Design Systems', 'Accessibility'],
    '6 years',
    'BFA Design, RISD'
  ),
  (
    candidate2_id,
    'seeker',
    'Marcus Johnson',
    'Full Stack Engineer',
    'Remote / NY',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80',
    'Full stack developer with a focus on scalable backend systems and clean frontend code. Love solving hard problems. I have experience building high-traffic applications and leading engineering teams.',
    ARRAY['Node.js', 'React', 'PostgreSQL', 'AWS', 'TypeScript', 'Docker'],
    '4 years',
    'BS CS, MIT'
  ),
  (
    candidate3_id,
    'seeker',
    'Emily Davis',
    'Marketing Specialist',
    'Chicago, IL',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80',
    'Data-driven marketer with a creative edge. I help brands find their voice and grow their audience through strategic campaigns. Specialized in content marketing, social media, and growth hacking.',
    ARRAY['Content Strategy', 'Social Media', 'Google Analytics', 'SEO', 'Email Marketing'],
    '3 years',
    'BA Marketing, UT Austin'
  ),
  (
    candidate4_id,
    'seeker',
    'David Kim',
    'DevOps Engineer',
    'Seattle, WA',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
    'Infrastructure as code enthusiast. I build robust CI/CD pipelines and manage cloud infrastructure for high-traffic apps. Expert in containerization, orchestration, and cloud platforms.',
    ARRAY['Docker', 'Kubernetes', 'Terraform', 'Python', 'AWS', 'CI/CD'],
    '7 years',
    'MS CS, UW'
  )
  ON CONFLICT (user_id, mode) DO NOTHING;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================
-- Run these queries to verify the data was inserted:

-- View all jobs (employer mode)
SELECT 
  id,
  name as company,
  title,
  location,
  salary,
  type,
  description,
  requirements
FROM profiles
WHERE mode = 'employer'
ORDER BY created_at DESC;

-- View all candidates (seeker mode)
SELECT 
  id,
  name,
  title,
  location,
  bio,
  skills,
  experience,
  education
FROM profiles
WHERE mode = 'seeker'
ORDER BY created_at DESC;

-- Count records
SELECT 
  mode,
  COUNT(*) as count
FROM profiles
GROUP BY mode;

-- ============================================
-- DONE! ✅
-- ============================================
-- Your sample data is now in the database!
-- The app will now fetch this data from Supabase instead of using mock data.

