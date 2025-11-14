-- Fix existing users who don't have profiles
-- Run this after setting up the trigger to fix any existing users

-- Create profiles for all existing users who don't have them
INSERT INTO public.profiles (id, email, full_name, role, is_active)
SELECT 
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1)  -- Use part before @ as name
  ) as full_name,
  'client' as role,  -- Default to client
  true as is_active
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL  -- Only for users without profiles
ON CONFLICT (id) DO NOTHING;

-- Show results
SELECT 
  'Fixed users:' as message,
  COUNT(*) as count
FROM auth.users u
JOIN public.profiles p ON u.id = p.id;

-- Make nanasefa@gmail.com an admin if they exist
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'nanasefa@gmail.com';

-- Show admin users
SELECT 
  u.email,
  p.role,
  p.full_name,
  p.is_active
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE p.role IN ('admin', 'doctor');