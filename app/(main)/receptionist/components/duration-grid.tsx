"use client";

import { differenceInMinutes, set } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FULL_MEETING_DURATION_OPTIONS } from "@/lib/constants";
import { useReceptionistBooking } from "./receptionist-booking-context";

function slotStartOnDate(slot: string, date: Date): Date {
  const [hours, minutes] = slot.split(":").map(Number);
  return set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
}

export default function DurationGrid() {
  const {
    meetings,
    selectedDate,
    selectedTime,
    selectedDuration,
    setSelectedDuration,
    isLoadingMeetings,
    isSubmitting,
  } = useReceptionistBooking();

  const availableMinutes = (() => {
    if (!selectedTime) return 0;
    const slotStart = slotStartOnDate(selectedTime, selectedDate);
    const nextMeeting = meetings
      .map((m) => ({ ...m, _start: new Date(m.start_time) }))
      .filter((m) => m._start >= slotStart)
      .sort((a, b) => a._start.getTime() - b._start.getTime())[0];

    if (!nextMeeting) return Infinity;
    return differenceInMinutes(nextMeeting._start, slotStart);
  })();

  if (isLoadingMeetings) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-11 rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {FULL_MEETING_DURATION_OPTIONS.map((option) => {
        const isDisabled =
          isSubmitting || !selectedTime || availableMinutes < Number(option.value);
        return (
          <Button
            key={option.value}
            variant="transparent"
            size="default"
            disabled={isDisabled}
            onClick={() => setSelectedDuration(option.value)}
            className={cn(
              "rounded-xl py-5 text-sm",
              selectedDuration === option.value &&
                "border-secondary bg-secondary text-[#0F401D]"
            )}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
