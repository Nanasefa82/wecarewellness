-- Check current state and sync users

-- Step 1: Check how many auth users exist
SELECT 'Total Auth Users' as info, COUNT(*) as count FROM auth.users;

-- Step 2: Check how many profiles exist
SELECT 'Total Profiles' as info, COUNT(*) as count FROM public.profiles;

-- Step 3: Find auth users without profiles
SELECT 
    'Missing Profiles' as info,
    au.id,
    au.email,
    au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Step 4: Manually insert missing profiles (safer than trigger for now)
INSERT INTO public.profiles (id, email, full_name, role, is_active, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(
        au.raw_user_meta_data->>'full_name',
        au.raw_user_meta_data->>'name', 
        split_part(au.email, '@', 1)
    ) as full_name,
    'client' as role,
    true as is_active,
    au.created_at,
    NOW() as updated_at
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
);

-- Step 5: Verify all users now have profiles
SELECT 
    au.email,
    p.full_name,
    p.role,
    p.is_active,
    CASE WHEN p.id IS NULL THEN 'MISSING PROFILE' ELSE 'HAS PROFILE' END as status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
