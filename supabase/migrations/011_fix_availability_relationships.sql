-- Fix availability_slots to reference doctor_profiles directly
-- This migration creates the proper relationship between availability_slots and doctor_profiles

-- First, let's add a doctor_profile_id column to availability_slots
ALTER TABLE availability_slots 
ADD COLUMN doctor_profile_id UUID REFERENCES doctor_profiles(id) ON DELETE CASCADE;

-- Update existing records to link availability_slots to doctor_profiles
-- This assumes that doctor_profiles.user_id matches availability_slots.doctor_id
UPDATE availability_slots 
SET doctor_profile_id = dp.id
FROM doctor_profiles dp
WHERE availability_slots.doctor_id = dp.user_id;

-- Create index for the new relationship
CREATE INDEX idx_availability_slots_doctor_profile ON availability_slots(doctor_profile_id);

-- Optional: You can keep the old doctor_id column for backward compatibility
-- or remove it if you want to use only the new relationship
-- ALTER TABLE availability_slots DROP COLUMN doctor_id;

-- Update the constraint to use the new relationship
ALTER TABLE availability_slots 
DROP CONSTRAINT IF EXISTS no_overlapping_slots;

-- Recreate the constraint with the new doctor_profile_id
-- Need to use btree_gist extension for UUID support in GIST indexes
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE availability_slots 
ADD CONSTRAINT no_overlapping_slots EXCLUDE USING gist (
    doctor_profile_id WITH =,
    tstzrange(start_time, end_time) WITH &&
) WHERE (is_available = true);