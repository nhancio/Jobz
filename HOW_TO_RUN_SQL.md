# How to Run the SQL Schema in Supabase

## Step-by-Step Instructions

### 1. Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (the one with URL: `https://dywrmnqcuhtynsxmhimr.supabase.co`)
3. In the left sidebar, click **"SQL Editor"** (it has a database icon)
4. Click **"New query"** button (top right)

### 2. Run the SQL Script

**Option A: Run All at Once (Recommended)**
1. Open `supabase-schema.sql` file
2. Copy **ALL** the contents (Ctrl+A, Ctrl+C or Cmd+A, Cmd+C)
3. Paste into the Supabase SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
5. Wait for it to complete - you should see "Success. No rows returned"

**Option B: Run in Parts (If Option A Fails)**

If you get errors, try running these sections one at a time:

#### Part 1: Create Tables
Run lines 12-111 from `supabase-schema.sql` (the CREATE TABLE statements)

#### Part 2: Create Indexes
Run lines 117-135 (the CREATE INDEX statements)

#### Part 3: Enable RLS
Run lines 142-145 (the ALTER TABLE ENABLE ROW LEVEL SECURITY statements)

#### Part 4: Create Policies
Run lines 152-239 (all the CREATE POLICY statements)

#### Part 5: Create Functions and Triggers
Run lines 246-322 (functions and triggers)

### 3. Verify It Worked

After running, verify by running this query in the SQL Editor:

```sql
-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'matches', 'swipes', 'user_preferences');
```

You should see 4 rows returned:
- profiles
- matches
- swipes
- user_preferences

## Troubleshooting

### Error: "Connection string is missing"
- **Solution**: Make sure you're in Supabase SQL Editor, not a different database tool
- Go to: Supabase Dashboard → SQL Editor → New Query
- You must be logged into Supabase

### Error: "permission denied"
- **Solution**: Make sure you're the project owner or have admin access
- Check your Supabase project permissions

### Error: "relation already exists"
- **Solution**: The table already exists. You can either:
  1. Drop existing tables first (see below)
  2. Or skip the CREATE TABLE statements and only run the rest

### To Drop Existing Tables (if needed):

```sql
-- WARNING: This deletes all data!
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS swipes CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

Then run the full schema script again.

## Quick Test

After running the schema, test with this query:

```sql
-- This should return an empty result (no error means tables exist)
SELECT COUNT(*) FROM profiles;
```

If you see `0` (zero), everything worked! ✅

