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

export const getMeetingsByRoom = async (roomId: string, date?: string) => {
  const supabase = await createClient();
  const dateObj = date ? new Date(date) : new Date();

  const dayStart = startOfDay(dateObj).toISOString();
  const dayEnd = endOfDay(dateObj).toISOString();
  const currentTime = new Date().toISOString();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("room_id", roomId)
    .gte("start_time", dayStart)
    .lte("start_time", dayEnd)
    .gte("end_time", currentTime)
    .order("start_time", { ascending: true });

  return {
    error: error?.message,
    meetings: (data ?? []).map((m) => parseMeeting(m as Record<string, unknown>)),
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
    .limit(1)
    .single();

  if (data) {
    return {
      error: error?.message,
      meeting: parseMeeting(data as Record<string, unknown>),
    };
  }

  const { data: nextData, error: nextError } = await supabase
    .from("bookings")
    .select("*")
    .eq("room_id", roomId)
    .gt("start_time", currentTime)
    .order("start_time", { ascending: true })
    .limit(1)
    .single();

  return {
    error: nextError?.message,
    meeting: nextData ? parseMeeting(nextData as Record<string, unknown>) : null,
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
    meetings: (data ?? []).map((m) => parseMeeting(m as Record<string, unknown>)),
  };
};
