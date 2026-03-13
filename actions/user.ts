"use server";

import { createClient } from "@/lib/supabase/server";

export const getAllUsers = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("users").select();

  return {
    error: error?.message,
    users: data,
  };
};

export const searchUsers = async (query: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select()
    .ilike("email", `%${query}%`);

  return {
    error: error?.message,
    users: data,
  };
};
