"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FULL_MEETING_DURATION_OPTIONS } from "@/lib/constants";
import { calculateAvailableDurations } from "@/lib/duration-helper";
import { useBookingContext } from "./booking-context";
import { parse } from "date-fns";

export default function DurationSlots() {
  const { meetings, selectedTime, selectedDuration, setSelectedDuration } =
    useBookingContext();

  const now = new Date();

  // Find the next meeting after the selected time slot
  const nextMeeting = selectedTime
    ? (() => {
        const slotStart = parse(selectedTime, "HH:mm", now);
        return meetings.find((m) => new Date(m.start_time) >= slotStart) ?? null;
      })()
    : (meetings.find((m) => new Date(m.end_time) > now) ?? null);

  const availability = calculateAvailableDurations(nextMeeting);

  return (
    <div className="mt-6 grid grid-cols-5 gap-2">
      {FULL_MEETING_DURATION_OPTIONS.map((option) => {
        const isDisabled =
          !selectedTime ||
          availability.isOngoingMeeting ||
          availability.availableMinutes < Number(option.value);
        return (
          <Button
            key={option.value}
            variant="transparent"
            size="default"
            disabled={isDisabled}
            onClick={() => setSelectedDuration(option.value)}
            className={cn(
              selectedDuration === option.value &&
                "border-secondary bg-secondary text-[#0F401D]",
              "rounded-xl py-6"
            )}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
