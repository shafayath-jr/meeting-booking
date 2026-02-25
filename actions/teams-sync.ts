"use server";

import { Meeting } from "@/types/meeting";

type SyncOperation = "create" | "update" | "delete";

/**
 * Synchronizes a booking to Microsoft Teams calendar via the daemon endpoint.
 * This is called after successful Supabase operations to keep Teams in sync.
 *
 * @param booking - The booking record to sync
 * @param operation - The type of operation (create, update, or delete)
 * @returns {Promise<{data?: string, error?: string}>} - Returns calendar_event_id on success
 */
export const syncBookingToTeams = async (booking: Meeting, operation: SyncOperation) => {
  const daemonUrl = process.env.TEAMS_DAEMON_URL;
  const daemonSecret = process.env.TEAMS_DAEMON_SECRET;

  // Skip sync if daemon is not configured
  if (!daemonUrl || !daemonSecret) {
    console.warn("Teams daemon not configured, skipping sync");
    return { data: null, error: null };
  }

  try {
    const response = await fetch(`${daemonUrl}/api/sync-to-teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation,
        booking,
        secret: daemonSecret,
      }),
      // 10 second timeout to avoid blocking the UI
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));
      console.error(`Teams sync failed (${operation}):`, errorData.error);
      return { error: errorData.error || "Failed to sync to Teams" };
    }

    const data = await response.json();

    if (!data.success) {
      console.error(`Teams sync failed (${operation}):`, data.error);
      return { error: data.error || "Unknown error syncing to Teams" };
    }

    console.log(`Teams sync successful (${operation}):`, data.calendar_event_id);
    return {
      data: data.calendar_event_id,
      error: null,
    };
  } catch (error) {
    // Handle timeout and network errors
    if (error instanceof Error) {
      if (error.name === "TimeoutError" || error.name === "AbortError") {
        console.error("Teams sync timeout:", error.message);
        return { error: "Teams sync timed out" };
      }

      console.error("Teams sync error:", error.message);
      return { error: error.message };
    }

    console.error("Unknown Teams sync error:", error);
    return { error: "Unknown error syncing to Teams" };
  }
};
