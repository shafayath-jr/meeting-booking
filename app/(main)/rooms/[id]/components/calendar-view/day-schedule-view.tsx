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
  className?: string;
}

export default function DayScheduleView({
  selectedDate,
  meetings,
  isLoading,
  onSlotClick,
  onMeetingClick,
  className,
}: DayScheduleViewProps) {
  if (!selectedDate) {
    return (
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center gap-4 p-8 text-muted-foreground",
          className
        )}
      >
        <p className="text-center">Select a day from the calendar to view its schedule</p>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <div className="mb-4 shrink-0">
        <h2 className="text-lg font-semibold">
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {meetings.length} meeting{meetings.length !== 1 ? "s" : ""} scheduled
        </p>
      </div>

      {/* Time slots */}
      <div className="min-h-0 flex-1 overflow-auto">
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
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-12 flex-1" />
        </div>
      ))}
    </div>
  );
}
