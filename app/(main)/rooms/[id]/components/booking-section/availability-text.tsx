"use client";

import { useBookingContext } from "./booking-context";

export default function AvailabilityText() {
  const { hasAvailableSlots, showSuccess } = useBookingContext();

  if (showSuccess) return null;

  return (
    <p className="text-xl text-secondary">
      {hasAvailableSlots ? "Slots are available for booking" : "No slots available"}
    </p>
  );
}
