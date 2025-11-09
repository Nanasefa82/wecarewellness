-- Function to get available time slots for a specific date range
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
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.doctor_id,
    COALESCE(dp.name, 'Dr. We Care Wellness') as doctor_name,
    a.start_time,
    a.end_time,
    a.appointment_type,
    a.notes
  FROM availability_slots a
  LEFT JOIN doctor_profiles dp ON a.doctor_id = dp.user_id
  WHERE 
    a.is_available = true
    AND a.start_time::DATE >= start_date
    AND a.start_time::DATE <= end_date
    AND (doctor_id_param IS NULL OR a.doctor_id = doctor_id_param)
  ORDER BY a.start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create recurring availability slots
CREATE OR REPLACE FUNCTION create_recurring_availability(
  doctor_id_param UUID,
  start_date DATE,
  end_date DATE,
  time_slots JSONB, -- [{"start": "09:00", "end": "10:00", "days": [1,2,3,4,5]}]
  appointment_type_param VARCHAR(50) DEFAULT 'consultation'
)
RETURNS INTEGER AS $$
DECLARE
  slot_count INTEGER := 0;
  iter_date DATE;
  time_slot JSONB;
  slot_start_time TIMESTAMPTZ;
  slot_end_time TIMESTAMPTZ;
  day_of_week INTEGER;
BEGIN
  -- Loop through each date in the range
  iter_date := start_date;
  WHILE iter_date <= end_date LOOP
    day_of_week := EXTRACT(DOW FROM iter_date); -- 0=Sunday, 1=Monday, etc.
    
    -- Loop through each time slot configuration
    FOR time_slot IN SELECT * FROM jsonb_array_elements(time_slots) LOOP
      -- Check if this day of week is included in the slot configuration
      IF jsonb_path_exists(time_slot->'days', '$[*] ? (@ == ' || day_of_week || ')') THEN
        -- Create the time slot
        slot_start_time := (iter_date || ' ' || (time_slot->>'start'))::TIMESTAMPTZ;
        slot_end_time := (iter_date || ' ' || (time_slot->>'end'))::TIMESTAMPTZ;
        
        -- Insert the availability slot (will be skipped if it conflicts due to constraint)
        BEGIN
          INSERT INTO availability_slots (
            doctor_id,
            start_time,
            end_time,
            appointment_type
          ) VALUES (
            doctor_id_param,
            slot_start_time,
            slot_end_time,
            appointment_type_param
          );
          slot_count := slot_count + 1;
        EXCEPTION WHEN OTHERS THEN
          -- Skip conflicting slots
          NULL;
        END;
      END IF;
    END LOOP;
    
    iter_date := iter_date + INTERVAL '1 day';
  END LOOP;
  
  RETURN slot_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get doctor's appointments for a date range
CREATE OR REPLACE FUNCTION get_doctor_appointments(
  doctor_id_param UUID,
  start_date DATE,
  end_date DATE
)
RETURNS TABLE (
  appointment_id UUID,
  slot_id UUID,
  client_name VARCHAR(255),
  client_email VARCHAR(255),
  client_phone VARCHAR(20),
  appointment_type VARCHAR(50),
  status VARCHAR(20),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  client_notes TEXT,
  doctor_notes TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id as appointment_id,
    a.availability_slot_id as slot_id,
    a.client_name,
    a.client_email,
    a.client_phone,
    a.appointment_type,
    a.status,
    s.start_time,
    s.end_time,
    a.client_notes,
    a.doctor_notes,
    a.created_at
  FROM appointments a
  JOIN availability_slots s ON a.availability_slot_id = s.id
  WHERE 
    s.doctor_id = doctor_id_param
    AND s.start_time::DATE >= start_date
    AND s.start_time::DATE <= end_date
  ORDER BY s.start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get appointment details with slot information
CREATE OR REPLACE FUNCTION get_appointment_details(appointment_id_param UUID)
RETURNS TABLE (
  appointment_id UUID,
  slot_id UUID,
  doctor_id UUID,
  doctor_name TEXT,
  client_name VARCHAR(255),
  client_email VARCHAR(255),
  client_phone VARCHAR(20),
  appointment_type VARCHAR(50),
  status VARCHAR(20),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  client_notes TEXT,
  doctor_notes TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id as appointment_id,
    a.availability_slot_id as slot_id,
    s.doctor_id,
    COALESCE(dp.name, 'Dr. We Care Wellness') as doctor_name,
    a.client_name,
    a.client_email,
    a.client_phone,
    a.appointment_type,
    a.status,
    s.start_time,
    s.end_time,
    a.client_notes,
    a.doctor_notes,
    a.created_at
  FROM appointments a
  JOIN availability_slots s ON a.availability_slot_id = s.id
  LEFT JOIN doctor_profiles dp ON s.doctor_id = dp.user_id
  WHERE a.id = appointment_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;