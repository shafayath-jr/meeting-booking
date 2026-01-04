"use client";
import { Button } from "@/components/ui/button";

export default function ActionButtons() {
  return (
    <div className="flex items-center gap-4">
      <Button>Quick meeting</Button>
      <Button>Book a meeting</Button>
      <Button>View calender</Button>
    </div>
  );
}
