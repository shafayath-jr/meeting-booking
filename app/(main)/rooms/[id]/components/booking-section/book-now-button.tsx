"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useBookingContext } from "./booking-context";

export default function BookNowButton() {
  const { openModal, showSuccess, hasAvailableSlots } = useBookingContext();

  if (showSuccess) return null;

  const disabled = !hasAvailableSlots;

  return (
    <div className="relative flex items-center justify-center">
      {hasAvailableSlots && (
        <>
          <div className="absolute h-28 w-28 animate-ping rounded-full border border-white/25" />
          <div className="absolute h-28 w-28 animate-ping rounded-full border border-primary/35 [animation-delay:0.7s]" />
        </>
      )}

      <Button
        variant="ghost"
        className={cn(
          "relative flex h-40 w-40 flex-col items-center justify-center rounded-full p-0",
          "border border-white/20 bg-white/8 backdrop-blur-md",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.15)]",
          "text-lg leading-tight font-bold tracking-widest text-secondary uppercase",
          "transition-all duration-300 hover:scale-105 hover:border-white/35 hover:bg-white/5 hover:text-white active:scale-[0.97]",
          disabled && "cursor-not-allowed opacity-40 saturate-0"
        )}
        type="button"
        onClick={openModal}
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
