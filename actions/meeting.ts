"use server";

import { createClient } from "@/lib/supabase/server";
import { Meeting } from "@/types/meeting";
import { Event } from "@/types/event";
import { startOfDay, endOfDay } from "date-fns";
import { revalidatePath } from "next/cache";
import { syncBookingToTeams } from "./teams-sync";

function parseMeeting(raw: Record<string, unknown>): Meeting {
  return {
    ...raw,
    guests: typeof raw.guests === "string" ? JSON.parse(raw.guests) : (raw.guests ?? []),
  } as Meeting;
}

function isCanceled(m: { title?: string | null }): boolean {
  return (m.title ?? "").trim().toLowerCase().startsWith("canceled:");
}

export const getMeetingsByRoom = async (roomId: string, date?: string) => {
  const supabase = await createClient();

  let dayStart: string;
  let dayEnd: string;
  const currentTime = new Date().toISOString();

  if (date) {
    const startObj = new Date(date);
    if (!isNaN(startObj.getTime())) {
      dayStart = startObj.toISOString();
      dayEnd = new Date(startObj.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString();
    } else {
      const dateObj = new Date();
      dayStart = startOfDay(dateObj).toISOString();
      dayEnd = endOfDay(dateObj).toISOString();
    }
  } else {
    const dateObj = new Date();
    dayStart = startOfDay(dateObj).toISOString();
    dayEnd = endOfDay(dateObj).toISOString();
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("room_id", roomId)
    .gte("start_time", dayStart)
    .lte("start_time", dayEnd)
    .gte("end_time", currentTime)
    .order("start_time", { ascending: true });

  console.log("getMeetingsByRoom debug:", {
    roomId,
    date,
    dayStart,
    dayEnd,
    currentTime,
    count: data?.length,
    error,
  });

  return {
    error: error?.message,
    meetings: (data ?? [])
      .map((m) => parseMeeting(m as Record<string, unknown>))
      .filter((m) => !isCanceled(m)),
    debug: {
      roomId,
      date,
      dayStart,
      dayEnd,
      currentTime,
      fetchedCount: data?.length ?? 0,
      sqlError: error?.message,
    },
  };
};

export const getNextMeetingByRoom = async (roomId: string) => {
  const supabase = await createClient();
  const currentTime = new Date().toISOString();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("room_id", roomId)
    .lte("start_time", currentTime)
    .gte("end_time", currentTime)
    .order("start_time", { ascending: true })
    .limit(5);

  const ongoing = (data ?? [])
    .map((m) => parseMeeting(m as Record<string, unknown>))
    .find((m) => !isCanceled(m));

  if (ongoing) {
    return {
      error: error?.message,
      meeting: ongoing,
    };
  }

  const { data: nextData, error: nextError } = await supabase
    .from("bookings")
    .select("*")
    .eq("room_id", roomId)
    .gt("start_time", currentTime)
    .order("start_time", { ascending: true })
    .limit(5);

  const upcoming = (nextData ?? [])
    .map((m) => parseMeeting(m as Record<string, unknown>))
    .find((m) => !isCanceled(m));

  return {
    error: nextError?.message,
    meeting: upcoming ?? null,
  };
};

export const bookMeeting = async (event: Event) => {
  const supabase = await createClient();

  // Generate UUID upfront to avoid race condition with webhook
  const bookingId = crypto.randomUUID();

  // Create Meeting object for Teams sync
  const tempBooking: Meeting = {
    ...event,
    id: bookingId,
    guests:
      typeof event.guests === "string" ? JSON.parse(event.guests) : (event.guests ?? []),
  };

  // Sync to Microsoft Teams calendar FIRST to get calendar_event_id and ical_uid
  const { data: syncData, error: syncError } = await syncBookingToTeams(
    tempBooking,
    "create"
  );

  // Prepare booking data with calendar_event_id and ical_uid already set
  const bookingData = {
    id: bookingId,
    ...event,
    calendar_event_id: syncError ? null : syncData?.calendarEventId,
    ical_uid: syncError ? null : syncData?.icalUid,
  };

  // Upsert into Supabase using ical_uid as conflict key to prevent duplicate
  // rows when the Teams daemon's reverse sync also tries to upsert the same event
  const { error } = await supabase
    .from("bookings")
    .upsert([bookingData], { onConflict: "ical_uid" })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  if (syncError) {
    console.warn("Teams sync failed but booking was created:", syncError);
  }

  revalidatePath(`/rooms/${event.room_id}`);
  return { error: null };
};

export const deleteMeeting = async (meetingId: string) => {
  const supabase = await createClient();

  // Fetch booking first to get calendar_event_id for Teams sync
  const { data: booking } = await supabase
    .from("bookings")
    .select()
    .eq("id", meetingId)
    .single();

  console.log("Delete: Fetched booking:", booking?.id);
  console.log("Delete: calendar_event_id:", booking?.calendar_event_id);

  // Sync deletion to Microsoft Teams BEFORE deleting from Supabase
  if (booking?.calendar_event_id) {
    console.log("Delete: Syncing to Teams...");
    const { error: syncError } = await syncBookingToTeams(booking, "delete");
    if (syncError) {
      console.warn("Teams sync failed but continuing with delete:", syncError);
      // Don't fail the delete if Teams sync fails
    } else {
      console.log("Delete: Teams sync successful");
    }
  } else {
    console.log("Delete: No calendar_event_id, skipping Teams sync");
  }

  // Delete from Supabase
  const { error } = await supabase.from("bookings").delete().eq("id", meetingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { error: null };
};

export const getMeetingsByRoomForDateRange = async (
  roomId: string,
  startDate: string,
  endDate: string
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("room_id", roomId)
    .gte("start_time", startDate)
    .lte("start_time", endDate)
    .order("start_time", { ascending: true });

  return {
    error: error?.message,
    meetings: (data ?? [])
      .map((m) => parseMeeting(m as Record<string, unknown>))
      .filter((m) => !isCanceled(m)),
  };
};
