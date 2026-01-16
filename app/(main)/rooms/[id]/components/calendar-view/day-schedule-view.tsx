"use client";

import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Meeting } from "@/types/meeting";
import TimeSlotGrid from "./time-slot-grid";
import { cn } from "@/lib/utils";

interface DayScheduleViewProps {
  selectedDate: Date | null;
  meetings: Meeting[];
  isLoading: boolean;
  onSlotClick: (time: string) => void;
  onMeetingClick?: (meeting: Meeting) => void;
  onBackToCalendar?: () => void;
  className?: string;
}

export default function DayScheduleView({
  selectedDate,
  meetings,
  isLoading,
  onSlotClick,
  onMeetingClick,
  onBackToCalendar,
  className,
}: DayScheduleViewProps) {
  if (!selectedDate) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8",
          className
        )}
      >
        <p className="text-center">Select a day from the calendar to view its schedule</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="font-semibold text-lg">
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {meetings.length} meeting{meetings.length !== 1 ? "s" : ""}{" "}
          scheduled
        </p>
      </div>

      {/* Time slots */}
      <div className="flex-1 min-h-0 overflow-auto">
        {isLoading ? (
          <DayScheduleSkeleton />
        ) : (
          <TimeSlotGrid
            selectedDate={selectedDate}
            meetings={meetings}
            onSlotClick={onSlotClick}
            onMeetingClick={onMeetingClick}
          />
        )}
      </div>
    </div>
  );
}

function DayScheduleSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="flex-1 h-12" />
        </div>
      ))}
    </div>
  );
}
