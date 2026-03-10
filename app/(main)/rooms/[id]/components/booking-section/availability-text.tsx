"use client";

import { useBookingContext } from "./booking-context";

export default function AvailabilityText() {
  const { hasAvailableSlots, showSuccess } = useBookingContext();

  if (showSuccess) return null;

  return (
    <p className="text-2xl text-secondary">
      {hasAvailableSlots ? "Check available slots" : "No slots available"}
    </p>
  );
}
