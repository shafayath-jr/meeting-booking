"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FULL_MEETING_DURATION_OPTIONS } from "@/lib/constants";
import { calculateAvailableDurations } from "@/lib/duration-helper";
import { Meeting } from "@/types/meeting";

type Props = {
  meetings: Meeting[];
};

export default function DurationSlots({ meetings }: Props) {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

  const now = new Date();
  const nextMeeting = meetings.find((m) => new Date(m.end_time) > now) ?? null;
  const availability = calculateAvailableDurations(nextMeeting);

  return (
    <div className="grid grid-cols-5 gap-2">
      {FULL_MEETING_DURATION_OPTIONS.map((option) => {
        const isDisabled =
          availability.isOngoingMeeting ||
          availability.availableMinutes < Number(option.value);
        return (
          <Button
            key={option.value}
            variant="transparent"
            size="lg"
            disabled={isDisabled}
            onClick={() => setSelectedDuration(option.value)}
            className={cn(
              selectedDuration === option.value && "border-brand-green bg-brand-green"
            )}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
