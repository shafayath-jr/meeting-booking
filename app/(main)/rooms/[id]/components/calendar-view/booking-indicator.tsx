"use client";

import { cn } from "@/lib/utils";

interface BookingIndicatorProps {
  hasBookings: boolean;
  className?: string;
}

export default function BookingIndicator({
  hasBookings,
  className,
}: BookingIndicatorProps) {
  if (!hasBookings) return null;

  return (
    <div
      className={cn("absolute bottom-1 left-1/2 -translate-x-1/2", className)}
      aria-label="Has bookings"
    >
      <span className="block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
    </div>
  );
}
