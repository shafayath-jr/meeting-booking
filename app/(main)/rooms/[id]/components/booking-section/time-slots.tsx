"use client";

import { useMemo } from "react";
import { isToday, isBefore, parse, addMinutes, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn, getTimeSlotsForTimezone } from "@/lib/utils";
import { useBookingContext } from "./booking-context";
import { useGradientContext } from "@/components/providers/gradient-context";

export default function TimeSlots() {
  const { meetings, selectedDate, selectedTime, setSelectedTime } = useBookingContext();
  const { variant } = useGradientContext();
  const isAvailable = variant === "available" || variant === "default";
  const isOngoing = variant === "ongoing" || variant === "unavailable";

  const availableSlots = useMemo(() => {
    const now = new Date();
    const isSelectedToday = isToday(selectedDate);

    return getTimeSlotsForTimezone().filter((slot) => {
      const slotStart = parse(slot, "HH:mm", selectedDate);
      const slotEnd = addMinutes(slotStart, 30);

      if (isSelectedToday && isBefore(slotStart, now)) return false;

      return !meetings.some((meeting) => {
        const meetingStart = new Date(meeting.start_time);
        const meetingEnd = new Date(meeting.end_time);
        return slotStart < meetingEnd && slotEnd > meetingStart;
      });
    });
  }, [meetings, selectedDate]);

  if (availableSlots.length === 0) {
    return (
      <p className="mt-6 text-sm font-semibold text-secondary">
        No available slots for{" "}
        {isToday(selectedDate) ? "today" : format(selectedDate, "EEE, MMM d")}.
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
            "rounded-xl py-6",
            isAvailable
              ? cn(
                  "border-[#6CADD5]/40 bg-white text-[#0A76B9] hover:border-[#6CADD5] hover:bg-[#6CADD5]/20",
                  selectedTime === slot &&
                    "border-[#06476F] bg-[#06476F] text-white hover:bg-[#06476F]/90"
                )
              : isOngoing
                ? cn(
                    "border-[#C07090]/40 bg-white text-[#7F012E] hover:border-[#C07090] hover:bg-[#C07090]/20",
                    selectedTime === slot &&
                      "border-[#7F012E] bg-[#7F012E] text-white hover:bg-[#7F012E]/90"
                  )
                : selectedTime === slot &&
                  "border-secondary bg-secondary text-[#0F401D] hover:bg-secondary/80"
          )}
        >
          {format(parse(slot, "HH:mm", new Date()), "hh:mma")}
        </Button>
      ))}
    </div>
  );
}
