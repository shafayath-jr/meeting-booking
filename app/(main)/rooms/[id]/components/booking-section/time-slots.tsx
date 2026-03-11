"use client";

import { useMemo } from "react";
import { isToday, isBefore, parse, addMinutes, format } from "date-fns";
import { TIME_SLOTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBookingContext } from "./booking-context";

export default function TimeSlots() {
  const { meetings, selectedTime, setSelectedTime } = useBookingContext();

  const availableSlots = useMemo(() => {
    const now = new Date();
    const today = isToday(now);

    return TIME_SLOTS.filter((slot) => {
      const slotStart = parse(slot, "HH:mm", now);
      const slotEnd = addMinutes(slotStart, 30);

      if (today && isBefore(slotStart, now)) return false;

      return !meetings.some((meeting) => {
        const meetingStart = new Date(meeting.start_time);
        const meetingEnd = new Date(meeting.end_time);
        return slotStart < meetingEnd && slotEnd > meetingStart;
      });
    });
  }, [meetings]);

  if (availableSlots.length === 0) {
    return (
      <p className="mt-6 text-sm font-semibold text-secondary">
        No available slots for today.
      </p>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-5 gap-2">
      {availableSlots.map((slot) => (
        <Button
          key={slot}
          variant="transparent"
          size="default"
          onClick={() => setSelectedTime(slot)}
          className={cn(
            selectedTime === slot &&
              "border-secondary bg-secondary text-[#0F401D] hover:bg-secondary/80",
            "rounded-xl py-6"
          )}
        >
          {format(parse(slot, "HH:mm", new Date()), "hh:mma")}
        </Button>
      ))}
    </div>
  );
}
