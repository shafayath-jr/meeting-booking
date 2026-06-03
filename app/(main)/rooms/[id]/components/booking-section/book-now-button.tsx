"use client";

import { Button } from "@/components/ui/button";
import { useBookingContext } from "./booking-context";
import { cn } from "@/lib/utils";

export default function BookNowButton() {
  const { openModal, showSuccess, hasAvailableSlots, meetings } = useBookingContext();

  if (showSuccess) return null;

  const disabled = !hasAvailableSlots;
  const now = new Date();
  const isOngoing = meetings.some(
    (m) => new Date(m.start_time) <= now && new Date(m.end_time) > now
  );

  return (
    <Button
      variant="secondary"
      type="button"
      onClick={openModal}
      disabled={disabled}
      className={cn(
        "w-full rounded-xl py-8 text-lg text-[#0A76B9]",
        isOngoing && "mx-auto flex"
      )}
      size="lg"
    >
      Book a new meeting
    </Button>
  );
}
