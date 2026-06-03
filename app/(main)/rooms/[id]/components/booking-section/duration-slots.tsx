"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FULL_MEETING_DURATION_OPTIONS } from "@/lib/constants";
import { calculateAvailableDurations } from "@/lib/duration-helper";
import { useBookingContext } from "./booking-context";
import { useGradientContext } from "@/components/providers/gradient-context";
import { parse } from "date-fns";

export default function DurationSlots() {
  const { meetings, selectedTime, selectedDuration, setSelectedDuration } =
    useBookingContext();
  const { variant } = useGradientContext();
  const isAvailable = variant === "available" || variant === "default";
  const isOngoing = variant === "ongoing" || variant === "unavailable";

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
              "rounded-xl py-6",
              isAvailable
                ? cn(
                    "border-[#6CADD5]/40 bg-white text-[#0A76B9] hover:border-[#6CADD5] hover:bg-[#6CADD5]/20",
                    selectedDuration === option.value &&
                      "border-[#06476F] bg-[#06476F] text-white hover:bg-[#06476F]/90"
                  )
                : isOngoing
                  ? cn(
                      "border-[#C07090]/40 bg-white text-[#7F012E] hover:border-[#C07090] hover:bg-[#C07090]/20",
                      selectedDuration === option.value &&
                        "border-[#7F012E] bg-[#7F012E] text-white hover:bg-[#7F012E]/90"
                    )
                  : selectedDuration === option.value &&
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
