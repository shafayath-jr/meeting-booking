"use client";

import { Button } from "@/components/ui/button";
import { useBookingContext } from "./booking-context";
import { useGradientContext } from "@/components/providers/gradient-context";
import { cn } from "@/lib/utils";

export default function BookNowButton() {
  const { openModal, showSuccess, todayHasAvailableSlots, todayMeetings } =
    useBookingContext();
  const { variant } = useGradientContext();
  const isBooked = variant === "ongoing" || variant === "unavailable";

  if (showSuccess) return null;

  const disabled = !todayHasAvailableSlots;
  const now = new Date();
  const isOngoing = todayMeetings.some(
    (m) => new Date(m.start_time) <= now && new Date(m.end_time) > now
  );

  return (
    <Button
      variant="secondary"
      type="button"
      onClick={openModal}
      disabled={disabled}
      className={cn(
        "w-full rounded-xl py-8 text-lg",
        isBooked ? "text-[#2D0808]" : "text-[#0A76B9]",
        isOngoing && "mx-auto flex"
      )}
      size="lg"
    >
      Book a new meeting
    </Button>
  );
}
