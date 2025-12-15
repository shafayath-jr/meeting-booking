import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

async function HomePage() {
  const supabase = await createClient();
  const { data: bookings } = await supabase.from("booking").select();

  return (
    <div className="">
      <Button>Submit</Button>;
    </div>
  );
}

export default HomePage;
