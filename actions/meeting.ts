"use server";

import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";

export const getAllMeetings = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("booking").select();

  return {
    error: error?.message,
    meetings: data,
  };
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
