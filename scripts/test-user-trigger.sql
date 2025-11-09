-- Test script to verify the user creation trigger is working
-- This will show you if the trigger is properly set up

-- 1. Check if the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated')
AND event_object_schema = 'auth';

-- 2. Check if the function exists
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name IN ('handle_new_user', 'handle_user_update');

-- 3. Check existing users and their profiles
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  p.role,
  p.full_name,
  p.is_active,
  p.created_at as profile_created,
  CASE 
    WHEN p.id IS NULL THEN 'MISSING PROFILE'
    ELSE 'HAS PROFILE'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 4. Create profiles for any users that don't have them
INSERT INTO public.profiles (id, email, full_name, role, is_active)
SELECT 
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1)
  ),
  'client',
  true
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 5. Show final status
SELECT 
  COUNT(*) as total_users,
  COUNT(p.id) as users_with_profiles,
  COUNT(*) - COUNT(p.id) as users_missing_profiles
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;