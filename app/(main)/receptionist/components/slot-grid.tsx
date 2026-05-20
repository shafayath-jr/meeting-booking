"use client";

import { useMemo } from "react";
import { addMinutes, format, isBefore, isSameDay, parse, set } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getTimeSlotsForTimezone } from "@/lib/utils";
import { useReceptionistBooking } from "./receptionist-booking-context";

function slotStartOnDate(slot: string, date: Date): Date {
  const [hours, minutes] = slot.split(":").map(Number);
  return set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
}

export default function SlotGrid() {
  const {
    meetings,
    selectedDate,
    selectedTime,
    setSelectedTime,
    isLoadingMeetings,
    isSubmitting,
  } = useReceptionistBooking();

  const availableSlots = useMemo(() => {
    const now = new Date();
    const isToday = isSameDay(selectedDate, now);

    return getTimeSlotsForTimezone().filter((slot) => {
      const slotStart = slotStartOnDate(slot, selectedDate);
      const slotEnd = addMinutes(slotStart, 30);

      if (isToday && isBefore(slotStart, now)) return false;

      return !meetings.some((meeting) => {
        const meetingStart = new Date(meeting.start_time);
        const meetingEnd = new Date(meeting.end_time);
        return slotStart < meetingEnd && slotEnd > meetingStart;
      });
    });
  }, [meetings, selectedDate]);

  if (isLoadingMeetings) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-11 rounded-xl bg-black/5" />
        ))}
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <p className="mt-2 text-sm font-medium text-foreground/50">
        No available slots for this date.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 xl:grid-cols-4">
      {availableSlots.map((slot) => (
        <Button
          key={slot}
          variant="transparent"
          size="default"
          disabled={isSubmitting}
          onClick={() => setSelectedTime(slot)}
          className={cn(
            "rounded-xl border border-black/15 py-5 text-sm text-foreground hover:bg-black/4",
            selectedTime === slot &&
              "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
          )}
        >
          {format(parse(slot, "HH:mm", new Date()), "hh:mma")}
        </Button>
      ))}
    </div>
  );
}
