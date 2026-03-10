"use client";

import { Button } from "@/components/ui/button";
import { useBookingContext } from "./booking-context";

export default function BookNowButton() {
  const { openModal, showSuccess, hasAvailableSlots } = useBookingContext();

  if (showSuccess) return null;

  const disabled = !hasAvailableSlots;

  return (
    <Button
      variant="secondary"
      type="button"
      onClick={openModal}
      disabled={disabled}
      className="rounded-xl py-8 text-lg"
      size="lg"
    >
      Book a new meeting
    </Button>
  );
}
