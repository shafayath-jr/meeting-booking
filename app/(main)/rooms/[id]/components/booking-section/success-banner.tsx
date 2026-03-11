"use client";

import { useEffect, useRef } from "react";
import { BadgeCheck } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";
import { useBookingContext } from "./booking-context";
import { Button } from "@/components/ui/button";

export default function SuccessBanner() {
  const { successData, resetFlow } = useBookingContext();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!successData) return;

    const timer = setTimeout(resetFlow, 10000);

    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        resetFlow();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [resetFlow]);

  if (!successData) return null;

  const { subject, hostName, startTime, endTime } = successData;
  const minsLeft = differenceInMinutes(startTime, new Date());
  const timeRange = `${format(startTime, "h:mma")}–${format(endTime, "h:mma")}`;

  const timeUntilStart = (() => {
    if (minsLeft <= 0) return null;
    const hrs = Math.floor(minsLeft / 60);
    const mins = minsLeft % 60;
    if (hrs > 0 && mins > 0) return `${hrs} hr ${mins} min`;
    if (hrs > 0) return `${hrs} hr${hrs !== 1 ? "s" : ""}`;
    return `${mins} min${mins !== 1 ? "s" : ""}`;
  })();

  return (
    <div
      ref={containerRef}
      className="space-y-6 rounded-xl border border-secondary/30 bg-secondary/5 p-8"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <BadgeCheck className="size-16 text-green-500" strokeWidth={1.5} />
        <h3 className="text-2xl font-semibold text-secondary">Successfully Booked</h3>
        <h5 className="text-lg text-secondary">Meeting Details</h5>
      </div>

      <div className="space-y-3">
        <div className="space-y-2 text-secondary/80">
          <div className="flex items-center gap-2">
            <span className="font-medium text-secondary">Meeting Subject:</span>
            <span>{subject}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-secondary">Meeting Host:</span>
            <span>{hostName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-secondary">Meeting Date:</span>
            <span>{format(startTime, "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-secondary">Meeting Time:</span>
            <span>{timeRange}</span>
          </div>
        </div>
        {timeUntilStart && (
          <p className="text-center text-sm font-semibold text-brand-yellow">
            Meeting starts in {timeUntilStart}
          </p>
        )}
      </div>

      <Button
        variant="transparent"
        className="w-full rounded-xl py-6"
        onClick={resetFlow}
      >
        Book Another Meeting
      </Button>
    </div>
  );
}
