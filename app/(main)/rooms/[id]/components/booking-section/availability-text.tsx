"use client";

import { useBookingContext } from "./booking-context";

type Props = {
  hasAvailableSlots: boolean;
};

export default function AvailabilityText({ hasAvailableSlots }: Props) {
  const { step } = useBookingContext();

  if (step > 0) return null;

  return (
    <p className="text-xl text-secondary">
      {hasAvailableSlots ? "Slots are available for booking" : "No slots available"}
    </p>
  );
}
