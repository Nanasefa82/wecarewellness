# Understanding Bookings vs Appointments

## The Two-Table System

Your application uses **two separate tables** for managing bookings:

### 1. `bookings` Table
**Purpose:** Stores booking form submissions from the public website

**Used by:**
- `BookingManager.tsx` (Admin panel)
- `useBookings.ts` hook
- Public booking forms

**Contains:**
- Detailed patient information (name, DOB, insurance, etc.)
- Medical history
- Emergency contacts
- Preferred date/time (not confirmed yet)
- Status: pending, confirmed, cancelled, completed

**Workflow:**
1. User fills out booking form on website
2. Data saved to `bookings` table with status "pending"
3. Admin reviews in BookingManager
4. Admin can confirm/cancel/complete

### 2. `appointments` Table
**Purpose:** Stores confirmed appointments linked to availability slots

**Used by:**
- `AppointmentsDashboard.tsx` (Doctor's view)
- `useAppointments.ts` hook
- Calendar management

**Contains:**
- Client name, email, phone
- Link to availability_slot_id
- Appointment type
- Status: scheduled, confirmed, cancelled, completed, no_show
- Client notes, doctor notes

**Workflow:**
1. Availability slot created by doctor
2. Client books the slot (creates appointment)
3. Appointment appears in AppointmentsDashboard
4. Doctor manages appointment status

## Your Current Situation

Based on your query results:
- ✅ You have **1 booking** in the `bookings` table
- ❓ You may have **0 appointments** in the `appointments` table

This is why:
- ✅ BookingManager should show the booking (after RLS fix)
- ❌ AppointmentsDashboard shows nothing (no appointments exist)

## How to Fix

### Option 1: Fix RLS for Both Tables (Recommended)
Run these SQL scripts in order:

1. **`final_rls_fix.sql`** - Fixes bookings table RLS
2. **`fix_appointments_rls.sql`** - Fixes appointments table RLS
3. **`check_both_tables.sql`** - Verify what data exists

### Option 2: Create an Appointment from the Booking
If you want the booking to appear in AppointmentsDashboard, you need to:

1. Create an availability slot (if not exists)
2. Create an appointment record linked to that slot
3. Or build a feature to "convert booking to appointment"

## Quick Diagnostic

Run **`check_both_tables.sql`** to see:
- How many bookings exist
- How many appointments exist
- How many availability slots exist

This will tell you exactly what data you have and where.

## Expected Behavior After Fixes

### After fixing bookings RLS:
- ✅ BookingManager will show your 1 booking
- ✅ You can view/update/delete bookings

### After fixing appointments RLS:
- ✅ AppointmentsDashboard will show appointments (if any exist)
- ✅ Doctors can manage their appointments

### If AppointmentsDashboard is still empty:
- This is normal if no appointments have been created yet
- Bookings and appointments are separate
- You need to either:
  - Create appointments directly, OR
  - Build a workflow to convert bookings to appointments

## Recommended Next Steps

1. Run `check_both_tables.sql` to see what data exists
2. Run `final_rls_fix.sql` to fix bookings table
3. Run `fix_appointments_rls.sql` to fix appointments table
4. Test both components in your app while logged in
5. Decide if you need to build a booking→appointment conversion feature
