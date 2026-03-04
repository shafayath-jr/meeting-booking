"use client";

import { useMemo, useState } from "react";
import { isToday, isBefore, parse, addMinutes, format } from "date-fns";
import { TIME_SLOTS } from "@/lib/constants";
import { Meeting } from "@/types/meeting";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  meetings: Meeting[];
};

export default function TimeSlots({ meetings }: Props) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
    return <p className="text-sm text-muted-foreground">No available slots for today.</p>;
  }

  return (
    <div className="grid grid-cols-5 gap-2">
      {availableSlots.map((slot) => (
        <Button
          key={slot}
          variant="transparent"
          size="lg"
          onClick={() => setSelectedTime(slot)}
          className={cn(selectedTime === slot && "border-brand-green bg-brand-green", "")}
        >
          {format(parse(slot, "HH:mm", new Date()), "hh:mma")}
        </Button>
      ))}
    </div>
  );
}
