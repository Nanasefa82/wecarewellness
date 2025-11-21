# EST Timezone Implementation

## Overview
All booking times and dates are now consistently handled in **Eastern Standard Time (EST)** / **Eastern Daylight Time (EDT)** timezone (`America/New_York`).

## Changes Made

### 1. Created Timezone Utility (`src/utils/timezone.ts`)
A centralized utility for all timezone conversions:

- `utcToEst(utcDateString)` - Convert UTC from database to EST
- `estToUtc(localDate)` - Convert EST to UTC for database storage
- `formatInEst(date, format)` - Format dates in EST timezone
- `formatTimeInEst(date)` - Format time with EST label
- `formatDateInEst(date)` - Format date in EST
- `formatDateTimeInEst(date)` - Format date and time in EST
- `nowInEst()` - Get current time in EST

### 2. Updated Components

#### BookingCalendar (`src/components/booking/BookingCalendar.tsx`)
- Uses `utcToEst()` to convert database timestamps to EST
- All displayed times are now in EST

#### BookingFormPage (`src/components/BookingFormPage.tsx`)
- Converts slot times to EST when pre-populating form
- Displays appointment times with "EST" label
- Uses `formatInEst()` for consistent date/time formatting

### 3. Updated Services

#### Email Service (`src/services/emailService.ts`)
- Changed default timezone from PST to EST
- Updated `formatDate()` to use `America/New_York` timezone
- Updated `formatTime()` to display EST instead of PST
- All email notifications now show times in EST

#### Booking Hook (`src/hooks/useBookings.ts`)
- Changed timezone parameter from 'PST' to 'EST' in email data

## Database Considerations

- Database stores all timestamps in UTC (standard practice)
- Conversion to EST happens at the application layer
- This ensures consistency across different user locations
- EST is used because the business operates in Eastern Time

## Testing

To verify EST timezone is working:

1. **Create a booking** - Check that times display with "EST" label
2. **View booking calendar** - Verify slot times are in EST
3. **Check email notifications** - Confirm times show EST
4. **Compare with UTC** - Database should store UTC, display should show EST

## Example

If a slot is stored in database as:
```
2025-12-29 14:00:00 UTC
```

It will display as:
```
9:00 AM EST (or 10:00 AM EDT during daylight saving time)
```

## Dependencies

- `date-fns` - Date manipulation
- `date-fns-tz@2.0.0` - Timezone conversions (compatible with date-fns v2)

## Future Considerations

- The timezone utility automatically handles EST/EDT transitions
- If business expands to other timezones, the utility can be extended
- Consider adding user timezone preferences if needed
