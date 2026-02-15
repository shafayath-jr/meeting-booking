"use client";

import { useMemo } from "react";
import { format, parse, isBefore, isToday, addMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { Meeting } from "@/types/meeting";
import { TIME_SLOTS } from "@/lib/constants";
import { TimeSlotInfo } from "./types";

interface TimeSlotGridProps {
  selectedDate: Date;
  meetings: Meeting[];
  onSlotClick: (time: string) => void;
  onMeetingClick?: (meeting: Meeting) => void;
  className?: string;
}

export default function TimeSlotGrid({
  selectedDate,
  meetings,
  onSlotClick,
  onMeetingClick,
  className,
}: TimeSlotGridProps) {
  const timeSlots = useMemo<TimeSlotInfo[]>(() => {
    const now = new Date();
    const isTodayDate = isToday(selectedDate);

    return TIME_SLOTS.filter((time) => {
      // Filter out past slots for today
      if (isTodayDate) {
        const slotStart = parse(time, "HH:mm", selectedDate);
        return !isBefore(slotStart, now);
      }
      return true;
    }).map((time) => {
      const slotStart = parse(time, "HH:mm", selectedDate);
      const slotEnd = addMinutes(slotStart, 30);

      // Find meeting that overlaps with this slot
      const overlappingMeeting = meetings.find((meeting) => {
        const meetingStart = new Date(meeting.start_time);
        const meetingEnd = new Date(meeting.end_time);
        return slotStart < meetingEnd && slotEnd > meetingStart;
      });

      return {
        time,
        isAvailable: !overlappingMeeting,
        meeting: overlappingMeeting,
      };
    });
  }, [selectedDate, meetings]);

  if (timeSlots.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <p className="text-sm text-muted-foreground">No time slots are available for today</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {timeSlots.map((slot, index) => {
        const isFirstOfMeeting =
          slot.meeting &&
          (index === 0 ||
            timeSlots[index - 1]?.meeting?.id !== slot.meeting.id);
        const isLastOfMeeting =
          slot.meeting &&
          (index === timeSlots.length - 1 ||
            timeSlots[index + 1]?.meeting?.id !== slot.meeting.id);

        return (
          <div
            key={slot.time}
            className={cn(
              "flex items-stretch min-h-[48px] rounded-lg transition-all duration-200 group",
              slot.isAvailable && !slot.meeting &&
                "hover:bg-primary/5 cursor-pointer border border-transparent hover:border-primary/20 hover:shadow-sm",
              !slot.isAvailable && !slot.meeting && "opacity-50"
            )}
            onClick={() => slot.isAvailable && !slot.meeting && onSlotClick(slot.time)}
            role={slot.isAvailable && !slot.meeting ? "button" : undefined}
            tabIndex={slot.isAvailable && !slot.meeting ? 0 : undefined}
            onKeyDown={(e) => {
              if (slot.isAvailable && !slot.meeting && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onSlotClick(slot.time);
              }
            }}
            aria-label={
              slot.isAvailable && !slot.meeting
                ? `Book meeting at ${slot.time}`
                : slot.meeting
                ? `${slot.meeting.title} at ${slot.time}`
                : `${slot.time} - unavailable`
            }
          >
            {/* Time label */}
            <div className="w-16 flex-shrink-0 py-2 pr-3 text-right text-sm text-muted-foreground font-medium">
              {slot.time}
            </div>

            {/* Slot content */}
            <div className="flex-1 py-1">
              {slot.meeting ? (
                <div
                  className={cn(
                    "h-full px-3 py-2 cursor-pointer transition-all duration-200",
                    "bg-gradient-to-r from-primary/15 to-primary/5 backdrop-blur-sm",
                    "border-l-4 border-primary",
                    "hover:from-primary/25 hover:to-primary/10 hover:shadow-md",
                    isFirstOfMeeting && "rounded-t-lg",
                    isLastOfMeeting && "rounded-b-lg"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMeetingClick?.(slot.meeting!);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      onMeetingClick?.(slot.meeting!);
                    }
                  }}
                  aria-label={`View details for ${slot.meeting.title}`}
                >
                  {isFirstOfMeeting && (
                    <>
                      <p className="font-semibold text-sm truncate text-foreground">
                        {slot.meeting.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {format(new Date(slot.meeting.start_time), "HH:mm")} -{" "}
                        {format(new Date(slot.meeting.end_time), "HH:mm")} •{" "}
                        {slot.meeting.booked_by}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center px-3 text-sm text-muted-foreground">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary/70">
                    Click to book
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
