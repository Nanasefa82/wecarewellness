-- Fix the get_available_slots function
-- The issue might be with the function syntax or RLS policies

-- Drop and recreate the function with better error handling
DROP FUNCTION IF EXISTS get_available_slots(DATE, DATE, UUID);

-- Recreate with improved implementation
CREATE OR REPLACE FUNCTION get_available_slots(
  start_date DATE,
  end_date DATE,
  doctor_id_param UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  doctor_id UUID,
  doctor_name TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  appointment_type VARCHAR(50),
  notes TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.doctor_id,
    COALESCE(dp.name, p.full_name, p.email) as doctor_name,
    a.start_time,
    a.end_time,
    a.appointment_type,
    a.notes
  FROM availability_slots a
  LEFT JOIN doctor_profiles dp ON a.doctor_id = dp.user_id
  LEFT JOIN profiles p ON a.doctor_id = p.id
  WHERE 
    a.is_available = true
    AND a.start_time::DATE >= start_date
    AND a.start_time::DATE <= end_date
    AND (doctor_id_param IS NULL OR a.doctor_id = doctor_id_param)
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = a.doctor_id 
      AND profiles.is_active = true
    )
  ORDER BY a.start_time;
END;
$$;

-- Grant execute permissions to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION get_available_slots(DATE, DATE, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_available_slots(DATE, DATE, UUID) TO anon;

-- Also ensure the doctor profile is active
UPDATE profiles 
SET 
    is_active = true,
    updated_at = NOW()
WHERE email = 'nanasefa@gmail.com' AND is_active IS NOT TRUE;

-- Test the function
DO $$
DECLARE
    test_result INTEGER;
BEGIN
    SELECT COUNT(*) INTO test_result
    FROM get_available_slots(CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days');
    
    RAISE NOTICE 'Function test: Found % available slots', test_result;
END;
$$;