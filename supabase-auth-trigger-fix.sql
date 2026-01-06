-- Fix: Ensure auth users get proper user profiles with auth_user_id set
-- This fixes the infinite loading on My Groups page by ensuring RLS policies can match users

-- 1. Create or replace the function that creates user profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new user profile when someone signs up
  INSERT INTO public.users (
    auth_user_id,
    email,
    display_name,
    is_guest,
    dietary_tags,
    created_at,
    last_active_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
    false,
    '{}',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Create function to link guest accounts to auth users
CREATE OR REPLACE FUNCTION public.link_guest_to_auth_user(
  guest_user_id UUID,
  auth_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Update the guest user to link it with the auth user
  UPDATE public.users
  SET
    auth_user_id = link_guest_to_auth_user.auth_user_id,
    is_guest = false,
    last_active_at = NOW()
  WHERE id = link_guest_to_auth_user.guest_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Fix any existing authenticated users who don't have auth_user_id set
-- This is a one-time migration for existing users
DO $$
DECLARE
  auth_record RECORD;
  user_record RECORD;
BEGIN
  -- Loop through all auth users
  FOR auth_record IN
    SELECT id, email, raw_user_meta_data
    FROM auth.users
  LOOP
    -- Check if a user profile exists with this email but no auth_user_id
    SELECT * INTO user_record
    FROM public.users
    WHERE email = auth_record.email
      AND (auth_user_id IS NULL OR auth_user_id != auth_record.id);

    IF FOUND THEN
      -- Link the existing user to the auth user
      UPDATE public.users
      SET auth_user_id = auth_record.id,
          is_guest = false,
          last_active_at = NOW()
      WHERE id = user_record.id;

      RAISE NOTICE 'Linked user % to auth user %', user_record.id, auth_record.id;
    END IF;
  END LOOP;
END $$;

-- 5. Add helpful comments
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a user profile when someone signs up via Supabase Auth';
COMMENT ON FUNCTION public.link_guest_to_auth_user(UUID, UUID) IS 'Links a guest user account to an authenticated user account';

-- 6. Verify the setup
SELECT
  'Auth users without profiles' as check_type,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.auth_user_id
WHERE pu.id IS NULL;
