/**
 * Timezone utilities for handling EST/EDT conversions
 * All booking times should be stored and displayed in Eastern Time
 */

import { format as dateFnsFormat } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

// Eastern Time Zone
export const TIMEZONE = 'America/New_York';
export const TIMEZONE_ABBR = 'EST';

/**
 * Parse a database timestamp as EST time
 * Database stores times without timezone info, treating them as EST
 */
export function utcToEst(dateString: string): Date {
    // The database stores times as if they're in EST, but without timezone info
    // We need to parse them as local EST times, not convert from UTC
    const date = new Date(dateString);
    
    // Get the components from the date string
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    
    // Create a new date treating these as local time components
    return new Date(year, month, day, hours, minutes, seconds);
}

/**
 * Convert a local Date object to EST and format as ISO string for database
 */
export function estToUtc(localDate: Date): string {
    const zonedDate = zonedTimeToUtc(localDate, TIMEZONE);
    return zonedDate.toISOString();
}

/**
 * Format a date in EST timezone
 * Database stores times as UTC components that represent EST time
 */
export function formatInEst(date: Date | string, formatString: string): string {
    const dateObj = typeof date === 'string' ? utcToEst(date) : date;
    return dateFnsFormat(dateObj, formatString);
}

/**
 * Get current time in EST
 */
export function nowInEst(): Date {
    return utcToZonedTime(new Date(), TIMEZONE);
}

/**
 * Format time for display (12-hour format with EST)
 */
export function formatTimeInEst(date: Date | string): string {
    return formatInEst(date, 'h:mm a') + ' EST';
}

/**
 * Format date for display
 */
export function formatDateInEst(date: Date | string): string {
    return formatInEst(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Format date and time for display
 */
export function formatDateTimeInEst(date: Date | string): string {
    return formatInEst(date, 'EEEE, MMMM d, yyyy \'at\' h:mm a') + ' EST';
}

/**
 * Parse a date string as if it's in EST timezone
 */
export function parseAsEst(dateString: string): Date {
    // Parse the date string and treat it as EST
    const date = new Date(dateString);
    return zonedTimeToUtc(date, TIMEZONE);
}

/**
 * Create a Date object in EST from date and time components
 */
export function createEstDate(year: number, month: number, day: number, hour: number = 0, minute: number = 0): Date {
    const localDate = new Date(year, month, day, hour, minute);
    return zonedTimeToUtc(localDate, TIMEZONE);
}
