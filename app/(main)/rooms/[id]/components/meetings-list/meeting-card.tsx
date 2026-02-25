"use client";

import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Meeting } from "@/types/meeting";
import { Badge } from "@/components/ui/badge";
import { cn, getCountdown } from "@/lib/utils";
import { useCurrentTime } from "@/hooks/use-current-time";
import DigitalClockCountdown from "./digital-clock-countdown";

interface MeetingCardProps {
  meeting: Meeting;
  onMeetingClick?: (meeting: Meeting) => void;
}

export default function MeetingCard({ meeting, onMeetingClick }: MeetingCardProps) {
  const currentTime = useCurrentTime();
  const meetingStart = new Date(meeting.start_time);
  const countdown = getCountdown(meetingStart, currentTime);
  const isSoon = countdown ? countdown.totalMinutes < 60 : false;

  return (
    <div
      onClick={() => onMeetingClick?.(meeting)}
      className={cn(
        "cursor-pointer rounded-xl p-4 transition-all duration-300",
        "bg-white/50 backdrop-blur-sm dark:bg-white/5",
        "border border-white/60 dark:border-white/10",
        "shadow-sm hover:scale-[1.01] hover:shadow-lg",
        "hover:bg-white/70 dark:hover:bg-white/10",
        onMeetingClick && "hover:border-primary/40",
        isSoon &&
          "border-destructive/40 bg-linear-to-br from-destructive/10 to-destructive/5"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold">{meeting.title}</h4>
            {isSoon && (
              <Badge
                variant="destructive"
                className="h-4 animate-pulse px-1.5 py-0 text-[10px]"
              >
                Soon
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {format(meetingStart, "h:mm a")} –{" "}
              {format(new Date(meeting.end_time), "h:mm a")}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground/80">{meeting.booked_by}</p>
        </div>
        {countdown && <DigitalClockCountdown meetingStart={meetingStart} />}
      </div>
    </div>
  );
}
