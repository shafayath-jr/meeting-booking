"use client";

import { useBookingContext } from "./booking-context";

export default function AvailabilityText() {
  const { hasAvailableSlots, showSuccess, meetings } = useBookingContext();

  if (showSuccess) return null;

  const now = new Date();
  const isOngoing = meetings.some(
    (m) => new Date(m.start_time) <= now && new Date(m.end_time) > now
  );
  if (isOngoing) return null;

  return (
    <p className="text-2xl text-secondary">
      {hasAvailableSlots ? "Check available slots" : "No slots available"}
    </p>
  );
}
