"use server";

import { createClient } from "@/lib/supabase/server";
import { Room } from "@/types/room";

export const getRoomById = async (roomId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("rooms").select().eq("id", roomId).single();

  return {
    error: error?.message,
    room: data as Room,
  };
};

export const getRoomsByBuilding = async (buildingId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .select()
    .eq("place_id", buildingId)
    .order("created_at", { ascending: true });

  return {
    error: error?.message,
    rooms: data as Room[],
  };
};
