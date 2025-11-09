-- Create doctor_profiles table
CREATE TABLE doctor_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  specialization TEXT,
  bio TEXT,
  default_appointment_duration INTEGER DEFAULT 60, -- minutes
  buffer_time INTEGER DEFAULT 15, -- minutes between appointments
  working_hours JSONB DEFAULT '{}', -- {"monday": {"start": "09:00", "end": "17:00", "enabled": true}, ...}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create availability_slots table
CREATE TABLE availability_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_available BOOLEAN DEFAULT true,
  appointment_type VARCHAR(50) DEFAULT 'consultation',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure no overlapping slots for the same doctor
  CONSTRAINT no_overlapping_slots EXCLUDE USING gist (
    doctor_id WITH =,
    tstzrange(start_time, end_time) WITH &&
  ) WHERE (is_available = true)
);

-- Create appointments table
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  availability_slot_id UUID REFERENCES availability_slots(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20),
  appointment_type VARCHAR(50) DEFAULT 'consultation',
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show')),
  client_notes TEXT,
  doctor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_availability_slots_doctor_time ON availability_slots(doctor_id, start_time);
CREATE INDEX idx_availability_slots_available ON availability_slots(is_available, start_time) WHERE is_available = true;
CREATE INDEX idx_appointments_slot_id ON appointments(availability_slot_id);
CREATE INDEX idx_appointments_client_email ON appointments(client_email);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_doctor_profiles_updated_at BEFORE UPDATE ON doctor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_availability_slots_updated_at BEFORE UPDATE ON availability_slots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();