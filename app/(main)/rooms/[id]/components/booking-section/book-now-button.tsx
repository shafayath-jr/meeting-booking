"use client";

import { Button } from "@/components/ui/button";
import { useBookingContext } from "./booking-context";

type Props = {
  hasAvailableSlots: boolean;
};

export default function BookNowButton({ hasAvailableSlots }: Props) {
  const { step, startBookingFlow, showSuccess } = useBookingContext();

  if (showSuccess) return null;

  const isPulsing = (step === 0 && hasAvailableSlots) || step === 1 || step === 2;
  const isSubmit = step === 3;

  return (
    <div className="relative flex items-center justify-center">
      {isPulsing && (
        <div className="absolute h-30 w-30 animate-ping rounded-full bg-secondary animation-duration-[1.5s]" />
      )}
      <Button
        className="relative flex h-48 w-48 cursor-pointer items-center justify-center rounded-full p-0 text-2xl font-bold text-brand-blue"
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
