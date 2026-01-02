import { createClient } from "@/lib/supabase/client";

export default function useMeetings() {
  const supabase = createClient();
  const data = supabase.from("booking").select();
  return {
    data,
  };
}
