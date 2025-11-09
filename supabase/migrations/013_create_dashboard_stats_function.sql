-- Create the get_doctor_dashboard_stats function
-- This function returns dashboard statistics for a doctor

CREATE OR REPLACE FUNCTION get_doctor_dashboard_stats(doctor_id_param UUID)
RETURNS TABLE(
  total_appointments INTEGER,
  upcoming_appointments INTEGER,
  completed_appointments INTEGER,
  cancelled_appointments INTEGER,
  available_slots INTEGER,
  next_appointment TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- Total appointments
    (SELECT COUNT(*)::INTEGER 
     FROM appointments a 
     JOIN availability_slots av ON a.availability_slot_id = av.id 
     WHERE av.doctor_id = doctor_id_param) as total_appointments,
    
    -- Upcoming appointments (scheduled or confirmed, in the future)
    (SELECT COUNT(*)::INTEGER 
     FROM appointments a 
     JOIN availability_slots av ON a.availability_slot_id = av.id 
     WHERE av.doctor_id = doctor_id_param 
     AND a.status IN ('scheduled', 'confirmed')
     AND av.start_time > NOW()) as upcoming_appointments,
    
    -- Completed appointments
    (SELECT COUNT(*)::INTEGER 
     FROM appointments a 
     JOIN availability_slots av ON a.availability_slot_id = av.id 
     WHERE av.doctor_id = doctor_id_param 
     AND a.status = 'completed') as completed_appointments,
    
    -- Cancelled appointments
    (SELECT COUNT(*)::INTEGER 
     FROM appointments a 
     JOIN availability_slots av ON a.availability_slot_id = av.id 
     WHERE av.doctor_id = doctor_id_param 
     AND a.status = 'cancelled') as cancelled_appointments,
    
    -- Available slots (future slots with no appointments)
    (SELECT COUNT(*)::INTEGER 
     FROM availability_slots av 
     LEFT JOIN appointments a ON a.availability_slot_id = av.id 
     WHERE av.doctor_id = doctor_id_param 
     AND av.is_available = true 
     AND av.start_time > NOW()
     AND a.id IS NULL) as available_slots,
    
    -- Next appointment time
    (SELECT MIN(av.start_time) 
     FROM appointments a 
     JOIN availability_slots av ON a.availability_slot_id = av.id 
     WHERE av.doctor_id = doctor_id_param 
     AND a.status IN ('scheduled', 'confirmed')
     AND av.start_time > NOW()) as next_appointment;
END;
$$ LANGUAGE plpgsql;