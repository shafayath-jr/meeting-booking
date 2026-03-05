"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useBookingContext } from "./booking-context";

export default function BookNowButton() {
  const { step, startBookingFlow, showSuccess, hasAvailableSlots } = useBookingContext();

  if (showSuccess) return null;

  const isPulsing = (step === 0 && hasAvailableSlots) || step === 1 || step === 2;
  const isSubmit = step === 3;
  const disabled = step === 0 && !hasAvailableSlots;

  return (
    <div className="relative flex items-center justify-center">
      {isPulsing && (
        <>
          <div className="absolute h-20 w-20 animate-ping rounded-full border border-white/25" />
          <div className="absolute h-20 w-20 animate-ping rounded-full border border-primary/35 [animation-delay:0.7s]" />
        </>
      )}

      <Button
        variant="ghost"
        className={cn(
          "relative h-32 w-32 rounded-full p-0",
          "bg-white/8 backdrop-blur-md",
          "border border-white/20",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.15)]",
          "hover:scale-105 hover:border-white/35 hover:bg-white/[0.14] hover:text-white",
          "active:scale-[0.97]",
          "transition-all duration-300",
          "text-xs leading-tight font-bold tracking-widest text-white uppercase",
          "flex flex-col items-center justify-center",
          disabled && "cursor-not-allowed opacity-40 saturate-0"
        )}
        type={isSubmit ? "submit" : "button"}
        form={isSubmit ? "meeting-details-form" : undefined}
        onClick={step === 0 ? startBookingFlow : undefined}
        disabled={disabled}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-br from-white/18 via-white/4 to-transparent"
          aria-hidden
        />
        <span className="relative z-10 text-center leading-tight">
          BOOK
          <br />
          NOW
        </span>
      </Button>
    </div>
  );
}
