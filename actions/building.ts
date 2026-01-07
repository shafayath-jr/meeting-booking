"use server";

import { createClient } from "@/lib/supabase/server";

export const getAllBuildings = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("buildings").select();

  return {
    error: error?.message,
    buildings: data,
  };
};

export const getBuildingById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("buildings")
    .select()
    .eq("id", id)
    .single();

  return {
    error: error?.message,
    building: data,
  };
};
