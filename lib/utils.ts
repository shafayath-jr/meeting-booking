import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, startOfToday } from "date-fns";

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
