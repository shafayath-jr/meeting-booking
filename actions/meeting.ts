"use server";

import { createClient } from "@/lib/supabase/server";
import { Event } from "@/types/event";
import { format } from "date-fns";

export const getAllMeetings = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("booking").select();

  return {
    error: error?.message,
    meetings: data,
  };
};

export const getMeetingById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("booking").select();
};

export const getMeetingsByRoom = async (
  room: string | undefined,
  date?: string
) => {
  const supabase = await createClient();
  const dateObj = date ? new Date(date) : new Date();
  const formattedDate = format(dateObj, "yyyy-MM-dd");
  const currentTime = format(new Date(), "HH:mm:ss");

  const { data, error } = await supabase
    .from("booking")
    .select("*")
    .eq("date", formattedDate)
    .eq("room", room)
    .gte("end", currentTime)
    .order("time", { ascending: true });

  return {
    error: error?.message,
    meetings: data,
  };
};

export const getNextMeetingByRoom = async (room?: string) => {
  const supabase = await createClient();
  const currentTime = new Date().toISOString();
  const currentDate = format(new Date(), "yyyy-MM-dd");

  const { data, error } = await supabase
    .from("booking")
    .select("*")
    .eq("room", room)
    .eq("date", currentDate)
    .gt("start", currentTime)
    .order("start", { ascending: true })
    .limit(1)
    .single();

  return {
    error: error?.message,
    meeting: data,
  };
};

export const bookMeeting = async (event: Event) => {
  const supabase = await createClient();
  const { error } = await supabase.from("bookings").insert([event]);

  return {
    error: error?.message,
  };
};
