-- Function to create doctor profile when user role is set to doctor
CREATE OR REPLACE FUNCTION handle_doctor_role_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- If role is being set to doctor and no doctor profile exists
  IF NEW.role = 'doctor' AND (OLD.role IS NULL OR OLD.role != 'doctor') THEN
    INSERT INTO doctor_profiles (user_id, name)
    VALUES (NEW.id, COALESCE(NEW.full_name, NEW.email))
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for doctor role assignment
CREATE TRIGGER on_doctor_role_assignment
  AFTER INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_doctor_role_assignment();