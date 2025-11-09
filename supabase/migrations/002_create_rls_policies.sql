-- Enable Row Level Security
ALTER TABLE doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Doctor Profiles Policies
CREATE POLICY "Doctors can view and manage their own profile" ON doctor_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view doctor profiles" ON doctor_profiles
  FOR SELECT USING (true);

-- Availability Slots Policies
CREATE POLICY "Doctors can manage their own availability slots" ON availability_slots
  FOR ALL USING (auth.uid() = doctor_id);

CREATE POLICY "Public can view available slots" ON availability_slots
  FOR SELECT USING (is_available = true);

-- Appointments Policies
CREATE POLICY "Doctors can view appointments for their slots" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM availability_slots 
      WHERE availability_slots.id = appointments.availability_slot_id 
      AND availability_slots.doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update appointments for their slots" ON appointments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM availability_slots 
      WHERE availability_slots.id = appointments.availability_slot_id 
      AND availability_slots.doctor_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- Function to automatically mark availability slot as unavailable when appointment is created
CREATE OR REPLACE FUNCTION mark_slot_unavailable()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE availability_slots 
  SET is_available = false 
  WHERE id = NEW.availability_slot_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to mark slot unavailable when appointment is created
CREATE TRIGGER mark_slot_unavailable_trigger
  AFTER INSERT ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION mark_slot_unavailable();

-- Function to mark slot available again when appointment is cancelled
CREATE OR REPLACE FUNCTION handle_appointment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If appointment is cancelled, mark slot as available again
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    UPDATE availability_slots 
    SET is_available = true 
    WHERE id = NEW.availability_slot_id;
  END IF;
  
  -- If appointment is rescheduled from cancelled, mark slot as unavailable
  IF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
    UPDATE availability_slots 
    SET is_available = false 
    WHERE id = NEW.availability_slot_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for appointment status changes
CREATE TRIGGER handle_appointment_status_change_trigger
  AFTER UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION handle_appointment_status_change();