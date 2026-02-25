import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  parseISO,
  startOfToday,
  differenceInSeconds,
  differenceInMinutes,
  differenceInDays,
} from "date-fns";
import { Meeting } from "@/types/meeting";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a Date object to YYYY-MM-DD format without timezone conversion.
 * @param date - Date object
 * @returns Date string in "YYYY-MM-DD" format (e.g., "2026-01-02")
 */
export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Validates and normalizes a date string from URL params.
 * Returns today if the date is invalid, in the past, or not provided.
 *
 * @param dateParam - Date string from URL params (e.g., "2024-01-15")
 * @returns Validated date string in "yyyy-MM-dd" format
 *
 * @example
 * validateDateParam("2024-12-31") // "2024-12-31" (if valid and future)
 * validateDateParam("2020-01-01") // Today's date (past date)
 * validateDateParam("invalid") // Today's date (invalid format)
 * validateDateParam(undefined) // Today's date (no param)
 */
export function validateDateParam(dateParam?: string): string {
  const today = format(startOfToday(), "yyyy-MM-dd");

  if (!dateParam) {
    return today;
  }

  try {
    const parsed = parseISO(dateParam);
    if (!isNaN(parsed.getTime()) && parsed >= startOfToday()) {
      return format(parsed, "yyyy-MM-dd");
    }
  } catch {
    // Invalid date format, return today
  }

  return today;
}

export function getCountdown(meetingStart: Date, currentTime: Date) {
  const diffSeconds = differenceInSeconds(meetingStart, currentTime);
  if (diffSeconds < 0) return null;

  const days = differenceInDays(meetingStart, currentTime);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const mins = Math.floor((diffSeconds % 3600) / 60);
  const secs = diffSeconds % 60;

  return {
    days,
    hours: String(hours).padStart(2, "0"),
    minutes: String(mins).padStart(2, "0"),
    seconds: String(secs).padStart(2, "0"),
    totalMinutes: differenceInMinutes(meetingStart, currentTime),
    totalSeconds: diffSeconds,
  };
}

export function getRemainingTime(meetingEnd: Date, currentTime: Date) {
  const diffSeconds = differenceInSeconds(meetingEnd, currentTime);
  if (diffSeconds <= 0) return null;

  const hours = Math.floor(diffSeconds / 3600);
  const mins = Math.floor((diffSeconds % 3600) / 60);
  const secs = diffSeconds % 60;

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(mins).padStart(2, "0"),
    seconds: String(secs).padStart(2, "0"),
    totalSeconds: diffSeconds,
  };
}

export function getProgress(meeting: Meeting, currentTime: Date) {
  const start = new Date(meeting.start_time).getTime();
  const end = new Date(meeting.end_time).getTime();
  const now = currentTime.getTime();
  return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
}

/**
 * Returns the next moment a meeting changes status:
 * the earliest of any ongoing meeting's end time or any upcoming meeting's start time.
 * Returns null if there are no relevant boundaries.
 */
export function getNextBoundary(meetings: Meeting[], now: Date): Date | null {
  let earliest: Date | null = null;

  for (const meeting of meetings) {
    const start = new Date(meeting.start_time);
    const end = new Date(meeting.end_time);

    const isOngoing = start <= now && end > now;
    const isUpcoming = start > now;

    const candidate = isOngoing ? end : isUpcoming ? start : null;
    if (candidate && (!earliest || candidate < earliest)) {
      earliest = candidate;
    }
  }

  return earliest;
}

export function nameFromEmail(email: string): string {
  const local = email.split("@")[0];
  return local
    .split(/[._]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
