-- Fix duplicate create_recurring_availability functions
-- Drop all versions and create only the correct one

-- Drop all versions of the function (this handles function overloading)
DROP FUNCTION IF EXISTS create_recurring_availability(UUID, DATE, DATE, JSONB);
DROP FUNCTION IF EXISTS create_recurring_availability(UUID, DATE, DATE, JSONB, VARCHAR);

-- Create the correct version only
CREATE OR REPLACE FUNCTION create_recurring_availability(
  doctor_id_param UUID,
  start_date DATE,
  end_date DATE,
  time_slots JSONB,
  appointment_type_param VARCHAR DEFAULT 'consultation'
) RETURNS TABLE(created_count INTEGER, skipped_count INTEGER) AS $$
DECLARE
  iter_date DATE;
  day_of_week INTEGER;
  time_slot JSONB;
  slot_start_time TIMESTAMPTZ;
  slot_end_time TIMESTAMPTZ;
  created_slots INTEGER := 0;
  skipped_slots INTEGER := 0;
  day_exists BOOLEAN;
BEGIN
  -- Loop through each date in the range
  iter_date := start_date;
  WHILE iter_date <= end_date LOOP
    day_of_week := EXTRACT(DOW FROM iter_date); -- 0=Sunday, 1=Monday, etc.
    
    -- Loop through each time slot configuration
    FOR time_slot IN SELECT * FROM jsonb_array_elements(time_slots) LOOP
      -- Check if this day of week is included in the slot configuration
      -- Replace jsonb_path_exists with a simpler approach
      SELECT EXISTS(
        SELECT 1 FROM jsonb_array_elements_text(time_slot->'days') AS day
        WHERE day::INTEGER = day_of_week
      ) INTO day_exists;
      
      IF day_exists THEN
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
            COALESCE(time_slot->>'type', appointment_type_param)
          );
          created_slots := created_slots + 1;
        EXCEPTION
          WHEN unique_violation OR exclusion_violation THEN
            -- Slot conflicts with existing slot, skip it
            skipped_slots := skipped_slots + 1;
        END;
      END IF;
    END LOOP;
    
    iter_date := iter_date + INTERVAL '1 day';
  END LOOP;
  
  RETURN QUERY SELECT created_slots, skipped_slots;
END;
$$ LANGUAGE plpgsql;