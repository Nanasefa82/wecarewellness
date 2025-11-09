# We Care Wellness - Booking System Documentation

## Overview

This document outlines the implementation of a comprehensive booking system for We Care Wellness LLC that allows:

1. **Doctors/Administrators** to create and manage availability slots
2. **Clients** to view available slots and book appointments
3. **Both parties** to manage and view their appointments

## System Architecture

### Database Schema

#### 1. `availability_slots` Table
Stores time slots that doctors make available for booking.

```sql
CREATE TABLE availability_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES auth.users(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_available BOOLEAN DEFAULT true,
  appointment_type VARCHAR(50) DEFAULT 'consultation',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `appointments` Table
Stores actual booked appointments.

```sql
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  availability_slot_id UUID REFERENCES availability_slots(id),
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20),
  appointment_type VARCHAR(50) DEFAULT 'consultation',
  status VARCHAR(20) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `doctor_profiles` Table
Stores doctor information and settings.

```sql
CREATE TABLE doctor_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  specialization TEXT,
  bio TEXT,
  default_appointment_duration INTEGER DEFAULT 60, -- minutes
  buffer_time INTEGER DEFAULT 15, -- minutes between appointments
  working_hours JSONB, -- {"monday": {"start": "09:00", "end": "17:00"}, ...}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_profiles ENABLE ROW LEVEL SECURITY;

-- Availability slots policies
CREATE POLICY "Doctors can manage their own availability" ON availability_slots
  FOR ALL USING (auth.uid() = doctor_id);

CREATE POLICY "Anyone can view available slots" ON availability_slots
  FOR SELECT USING (is_available = true);

-- Appointments policies
CREATE POLICY "Doctors can view appointments for their slots" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM availability_slots 
      WHERE availability_slots.id = appointments.availability_slot_id 
      AND availability_slots.doctor_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- Doctor profiles policies
CREATE POLICY "Doctors can manage their own profile" ON doctor_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view doctor profiles" ON doctor_profiles
  FOR SELECT USING (true);
```

## Frontend Components Structure

### 1. Admin/Doctor Interface
- **AvailabilityManager**: Create and manage time slots
- **AppointmentDashboard**: View and manage booked appointments
- **CalendarView**: Visual calendar interface for availability management

### 2. Client Interface
- **BookingCalendar**: View available slots and book appointments
- **AppointmentForm**: Collect client information for booking
- **BookingConfirmation**: Confirm appointment details

### 3. Shared Components
- **Calendar**: Reusable calendar component
- **TimeSlotPicker**: Time selection interface
- **AppointmentCard**: Display appointment information

## API Hooks Structure

### 1. Availability Management
```typescript
// useAvailability.ts
export const useAvailability = () => {
  const createAvailabilitySlot = (slot: AvailabilitySlot) => Promise<void>
  const getAvailabilitySlots = (doctorId?: string, dateRange?: DateRange) => Promise<AvailabilitySlot[]>
  const updateAvailabilitySlot = (id: string, updates: Partial<AvailabilitySlot>) => Promise<void>
  const deleteAvailabilitySlot = (id: string) => Promise<void>
}
```

### 2. Appointment Management
```typescript
// useAppointments.ts
export const useAppointments = () => {
  const bookAppointment = (appointment: CreateAppointmentData) => Promise<Appointment>
  const getAppointments = (filters?: AppointmentFilters) => Promise<Appointment[]>
  const updateAppointment = (id: string, updates: Partial<Appointment>) => Promise<void>
  const cancelAppointment = (id: string) => Promise<void>
}
```

### 3. Doctor Profile Management
```typescript
// useDoctorProfile.ts
export const useDoctorProfile = () => {
  const getDoctorProfile = (userId: string) => Promise<DoctorProfile>
  const updateDoctorProfile = (updates: Partial<DoctorProfile>) => Promise<void>
  const createDoctorProfile = (profile: CreateDoctorProfileData) => Promise<DoctorProfile>
}
```

## TypeScript Interfaces

```typescript
export interface AvailabilitySlot {
  id: string;
  doctor_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  appointment_type: 'consultation' | 'therapy' | 'evaluation';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  availability_slot_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  appointment_type: 'consultation' | 'therapy' | 'evaluation';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
  availability_slot?: AvailabilitySlot;
}

export interface DoctorProfile {
  id: string;
  user_id: string;
  name: string;
  specialization?: string;
  bio?: string;
  default_appointment_duration: number;
  buffer_time: number;
  working_hours: WorkingHours;
  created_at: string;
  updated_at: string;
}

export interface WorkingHours {
  [key: string]: {
    start: string;
    end: string;
    enabled: boolean;
  };
}
```

## Features Implementation Plan

### Phase 1: Core Infrastructure
1. Set up Supabase client configuration
2. Create database tables and RLS policies
3. Implement basic TypeScript interfaces
4. Create core API hooks

### Phase 2: Admin Interface
1. Doctor authentication and profile management
2. Availability slot creation and management
3. Appointment dashboard for doctors
4. Calendar view for availability management

### Phase 3: Client Interface
1. Public booking calendar
2. Appointment booking form
3. Booking confirmation system
4. Email notifications (optional)

### Phase 4: Advanced Features
1. Recurring availability slots
2. Appointment reminders
3. Cancellation and rescheduling
4. Integration with existing contact form

## Security Considerations

1. **Authentication**: Use Supabase Auth for doctor login
2. **Authorization**: RLS policies ensure data access control
3. **Data Validation**: Client-side and server-side validation
4. **Rate Limiting**: Prevent booking spam
5. **Email Verification**: Verify client email addresses

## Integration Points

1. **Existing Contact Form**: Link booking system to current contact section
2. **Navigation**: Add booking links to header and CTA buttons
3. **Styling**: Match existing sage green theme and typography
4. **Responsive Design**: Ensure mobile-friendly calendar interface

## Dependencies Required

```json
{
  "@supabase/supabase-js": "^2.x.x",
  "date-fns": "^2.x.x",
  "react-calendar": "^4.x.x",
  "react-hook-form": "^7.x.x",
  "@hookform/resolvers": "^3.x.x",
  "zod": "^3.x.x"
}
```

## Environment Variables

Already configured in your .env file:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_SERVICE_ROLE_KEY`

## Next Steps

1. Review this documentation
2. Install required dependencies
3. Create database migrations
4. Implement core hooks and utilities
5. Build admin interface components
6. Build client booking interface
7. Integrate with existing website
8. Test and deploy

Would you like me to proceed with the implementation starting with the database setup and core infrastructure?