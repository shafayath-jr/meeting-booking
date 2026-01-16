"use server";

import { createClient } from "@/lib/supabase/server";
import { Meeting } from "@/types/meeting";
import { Event } from "@/types/event";
import { startOfDay, endOfDay } from "date-fns";
import { revalidatePath } from "next/cache";

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
    meetings: data as Meeting[],
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
      meeting: data,
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
    meeting: nextData,
  };
};

export const bookMeeting = async (event: Event) => {
  const supabase = await createClient();
  const { error } = await supabase.from("bookings").insert([event]);

  if (!error) {
    revalidatePath(`/rooms/${event.room_id}`);
  }

  return {
    error: error?.message,
  };
};

export const deleteMeeting = async (meetingId: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", meetingId);

  if (!error) {
    revalidatePath("/");
  }

  return {
    error: error?.message,
  };
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
    meetings: data as Meeting[],
  };
};
