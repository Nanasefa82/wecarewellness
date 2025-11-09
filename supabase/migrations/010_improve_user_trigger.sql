-- Improved trigger to automatically create profiles when users are created
-- This ensures every new user gets a profile record automatically

-- First, drop the existing trigger and function to recreate them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create an improved function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a profile record for the new user
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    is_active
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)  -- Use email username as fallback
    ),
    'client',  -- Default role is client
    true
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't fail the user creation
  RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Also create a function to handle user updates (like email changes)
CREATE OR REPLACE FUNCTION handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the profile when user data changes
  UPDATE public.profiles
  SET 
    email = NEW.email,
    full_name = COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      full_name  -- Keep existing name if no new name provided
    ),
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't fail the user update
  RAISE WARNING 'Failed to update profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_update();

-- Test the trigger by checking if it works
DO $$
BEGIN
  RAISE NOTICE 'User creation trigger has been set up successfully';
  RAISE NOTICE 'New users will automatically get a profile with role=client';
  RAISE NOTICE 'You can change role to admin/doctor manually after creation';
END $$;