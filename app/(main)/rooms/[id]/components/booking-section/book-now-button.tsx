"use client";

import { Button } from "@/components/ui/button";
import { useBookingContext } from "./booking-context";

export default function BookNowButton() {
  const { step, startBookingFlow, showSuccess, hasAvailableSlots } = useBookingContext();

  if (showSuccess) return null;

  const isPulsing = (step === 0 && hasAvailableSlots) || step === 1 || step === 2;
  const isSubmit = step === 3;

  return (
    <div className="relative flex items-center justify-center">
      {isPulsing && (
        <div className="absolute h-20 w-20 animate-ping rounded-full bg-secondary animation-duration-[1.5s]" />
      )}
      <Button
        className="relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-full p-0 text-lg font-bold text-brand-blue"
        variant="secondary"
        type={isSubmit ? "submit" : "button"}
        form={isSubmit ? "meeting-details-form" : undefined}
        onClick={step === 0 ? startBookingFlow : undefined}
        disabled={step === 0 && !hasAvailableSlots}
      >
        BOOK NOW
      </Button>
    </div>
  );
}
