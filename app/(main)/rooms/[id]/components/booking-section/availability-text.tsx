"use client";

import { useBookingContext } from "./booking-context";
import { useGradientContext } from "@/components/providers/gradient-context";
import { cn } from "@/lib/utils";

export default function AvailabilityText() {
  const { hasAvailableSlots, showSuccess, meetings } = useBookingContext();
  const { variant } = useGradientContext();
  const isBooked = variant === "ongoing" || variant === "unavailable";

  if (showSuccess) return null;

  const now = new Date();
  const isOngoing = meetings.some(
    (m) => new Date(m.start_time) <= now && new Date(m.end_time) > now
  );
  if (isOngoing) return null;

  return (
    <p className={cn("text-lg", isBooked ? "text-[#2D0808]" : "text-[#06476F]")}>
      {hasAvailableSlots ? "Check available slots" : "No slots available"}
    </p>
  );
}
