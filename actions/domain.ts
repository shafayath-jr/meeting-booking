"use server";

import { createClient } from "@/lib/supabase/server";
import { Domain } from "@/types/domain";

export const getAllDomains = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("domains").select();

  return {
    error: error?.message,
    domains: data as Domain[],
  };
};
