"use client";

import { cn } from "@/lib/utils";

interface BookingIndicatorProps {
  count: number;
  className?: string;
}

export default function BookingIndicator({ count, className }: BookingIndicatorProps) {
  if (count === 0) return null;

  return (
    <div
      className={cn(
        "absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5",
        className
      )}
      aria-label={`${count} booking${count > 1 ? "s" : ""}`}
    >
      {count <= 3 ? (
        Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary"
            aria-hidden="true"
          />
        ))
      ) : (
        <>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
        </>
      )}
    </div>
  );
}
