# Supabase Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in details:
   - **Name:** ChickenTinders
   - **Database Password:** (generate a strong password and save it)
   - **Region:** Choose closest to your users
5. Click "Create new project"

Wait ~2 minutes for the project to initialize.

### Step 2: Run Database Schema

1. In your Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL editor
5. Click "Run" or press Ctrl+Enter

You should see: "Success. No rows returned"

This creates all the tables, indexes, and security policies.

### Step 3: Get API Keys

1. In Supabase dashboard, go to "Settings" (gear icon) → "API"
2. Find these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### Step 4: Add to Your Project

1. In your ChickenTinders project, create `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your values:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important:** Never commit `.env.local` to git (already in .gitignore)

### Step 5: Test Connection

Start your dev server:
```bash
npm run web
```

1. Navigate to "Create Group"
2. Fill in the form
3. Click "Create Group"
4. You should be redirected to the lobby

Check in Supabase dashboard → "Table Editor":
- `users` should have 1 row
- `groups` should have 1 row
- `group_members` should have 1 row

## 🔧 Verify Setup

### Check Tables

In Supabase SQL Editor, run:

```sql
-- Check if all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- analytics_events
- group_members
- groups
- matches
- swipes
- users

### Check RLS Policies

```sql
-- Check Row Level Security is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All should show `rowsecurity = true`

## 🌐 Deploy Environment Variables

### For Vercel:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - `EXPO_PUBLIC_SUPABASE_URL` = your project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = your anon key
4. Apply to: Production, Preview, and Development
5. Redeploy your app

### For Local Development:

Just use `.env.local` as described above.

## 📊 Database Schema Overview

### Tables Created:

1. **users** - Guest users (no passwords)
   - Stores: display_name, dietary_tags
   - Auto-generated UUID

2. **groups** - Group sessions
   - ID: 6-character code (e.g., CHKN22)
   - Settings: zip_code, radius, price_tier
   - Auto-expires after 24 hours

3. **group_members** - Join table
   - Links users to groups
   - Tracks when they joined

4. **swipes** - User swipe actions
   - Links user + group + restaurant
   - Tracks likes/super-likes

5. **matches** - Matched restaurants
   - Stores full restaurant data from Yelp
   - Tracks unanimous matches

6. **analytics_events** - (Optional) Track events

### Security:

- Row Level Security (RLS) enabled on all tables
- Policies allow guest users to:
  - Create their own user record
  - Join any group via link
  - Swipe on restaurants
  - View matches

## 🧪 Test Data (Optional)

Insert some test data to play around:

```sql
-- Create a test user
INSERT INTO users (id, display_name, dietary_tags)
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'Test User', ARRAY['vegan']);

-- Create a test group
INSERT INTO groups (id, zip_code, radius, price_tier, expires_at, status)
VALUES ('TEST01', '10001', 10, 2, NOW() + INTERVAL '24 hours', 'waiting');

-- Join the group
INSERT INTO group_members (group_id, user_id)
VALUES ('TEST01', '123e4567-e89b-12d3-a456-426614174000');
```

Then visit: `http://localhost:8081/lobby/TEST01`

## 🐛 Troubleshooting

**Error: "Invalid API key"**
- Double-check your `.env.local` has correct values
- Restart dev server after adding env vars

**Error: "permission denied for table users"**
- Make sure you ran the full `supabase-schema.sql`
- Check RLS policies are created

**Error: "relation 'groups' does not exist"**
- You didn't run the schema SQL
- Go to SQL Editor and run `supabase-schema.sql`

**Groups not expiring**
- Auto-expiration requires a cron job (Phase 7)
- For now, groups expire when checked

## ✅ You're Done!

Your Supabase backend is ready. Now you can:
- Create groups
- Join groups via links
- Store swipes
- Match restaurants

Next: Build the real-time Lobby (Phase 3)

---

Need help? Check Supabase docs: https://supabase.com/docs
