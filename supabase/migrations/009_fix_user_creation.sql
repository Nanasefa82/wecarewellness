-- First, let's make sure the trigger function handles errors gracefully
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile with error handling
  BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger to ensure it's working
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Also let's make sure the profiles table allows the email to be the same as auth.users
-- In case there's a unique constraint issue
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_email_key;

-- Add a function to manually create profiles for existing users who might not have them
CREATE OR REPLACE FUNCTION create_missing_profiles()
RETURNS INTEGER AS $$
DECLARE
  user_record RECORD;
  profile_count INTEGER := 0;
BEGIN
  -- Loop through users who don't have profiles
  FOR user_record IN 
    SELECT u.id, u.email, u.raw_user_meta_data
    FROM auth.users u
    LEFT JOIN profiles p ON u.id = p.id
    WHERE p.id IS NULL
  LOOP
    BEGIN
      INSERT INTO profiles (id, email, full_name, role)
      VALUES (
        user_record.id,
        user_record.email,
        COALESCE(user_record.raw_user_meta_data->>'full_name', user_record.email),
        'client'
      );
      profile_count := profile_count + 1;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to create profile for user %: %', user_record.id, SQLERRM;
    END;
  END LOOP;
  
  RETURN profile_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the function to create any missing profiles
SELECT create_missing_profiles();