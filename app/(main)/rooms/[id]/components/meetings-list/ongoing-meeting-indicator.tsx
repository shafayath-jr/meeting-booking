"use client";

import { format } from "date-fns";
import { Clock, Radio } from "lucide-react";
import { Meeting } from "@/types/meeting";
import { Badge } from "@/components/ui/badge";
import { cn, getRemainingTime, getProgress } from "@/lib/utils";
import { useCurrentTime } from "@/hooks/use-current-time";

interface OngoingMeetingIndicatorProps {
  meeting: Meeting;
  onMeetingClick?: (meeting: Meeting) => void;
}

export default function OngoingMeetingIndicator({
  meeting,
  onMeetingClick,
}: OngoingMeetingIndicatorProps) {
  const currentTime = useCurrentTime();
  const remaining = getRemainingTime(new Date(meeting.end_time), currentTime);
  const progress = getProgress(meeting, currentTime);
  const isEndingSoon = remaining && remaining.totalSeconds < 300;

  if (!remaining) return null;

  return (
    <div
      onClick={() => onMeetingClick?.(meeting)}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300",
        "bg-linear-to-br from-emerald-500/20 via-emerald-500/10 to-teal-500/20",
        "dark:from-emerald-500/30 dark:via-emerald-500/15 dark:to-teal-500/30",
        "border-2 border-emerald-500/50 dark:border-emerald-400/50",
        "shadow-lg shadow-emerald-500/20 dark:shadow-emerald-500/10",
        "hover:scale-[1.01] hover:shadow-xl hover:shadow-emerald-500/30",
        isEndingSoon &&
          "border-amber-500/60 from-amber-500/20 via-amber-500/10 to-orange-500/20 shadow-amber-500/20 dark:from-amber-500/30 dark:via-amber-500/15 dark:to-orange-500/30"
      )}
    >
      <div className="animate-pulse-slow absolute inset-0 opacity-30">
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-r",
            isEndingSoon
              ? "from-amber-400/40 via-transparent to-amber-400/40"
              : "from-emerald-400/40 via-transparent to-emerald-400/40"
          )}
        />
      </div>

      <div className="absolute right-0 bottom-0 left-0 h-1 bg-black/10 dark:bg-white/10">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-linear",
            isEndingSoon
              ? "bg-linear-to-r from-amber-500 to-orange-500"
              : "bg-linear-to-r from-emerald-500 to-teal-500"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative p-4">
        <div className="flex items-start gap-4">
          <div className="mt-1 shrink-0">
            <div className="relative">
              <div
                className={cn(
                  "h-3 w-3 rounded-full",
                  isEndingSoon ? "bg-amber-500" : "bg-emerald-500"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 animate-ping rounded-full",
                    isEndingSoon ? "bg-amber-500" : "bg-emerald-500"
                  )}
                />
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "h-5 px-2 py-0.5 text-[10px] font-semibold tracking-wide",
                  isEndingSoon
                    ? "border border-amber-500/30 bg-amber-500/20 text-amber-700 dark:text-amber-300"
                    : "border border-emerald-500/30 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                )}
              >
                <Radio className="mr-1 h-2.5 w-2.5 animate-pulse" />
                LIVE
              </Badge>
              {isEndingSoon && (
                <Badge
                  variant="outline"
                  className="h-4 animate-pulse border-amber-500/50 px-1.5 py-0 text-[10px] text-amber-600 dark:text-amber-400"
                >
                  Ending soon
                </Badge>
              )}
            </div>
            <h4 className="mb-1 truncate text-base font-bold">{meeting.title}</h4>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {format(new Date(meeting.start_time), "h:mm a")} -{" "}
                {format(new Date(meeting.end_time), "h:mm a")}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground/80">{meeting.booked_by}</p>
          </div>

          <div
            className={cn(
              "min-w-[120px] shrink-0 rounded-lg px-4 py-3",
              "bg-white/60 backdrop-blur-sm dark:bg-black/30",
              "border",
              isEndingSoon ? "border-amber-500/40" : "border-emerald-500/40"
            )}
          >
            <div className="text-center">
              <div
                className={cn(
                  "mb-1 text-[9px] font-semibold tracking-wider uppercase",
                  isEndingSoon
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
                )}
              >
                Remaining
              </div>
              <div
                className={cn(
                  "font-mono text-xl leading-none font-bold tabular-nums",
                  isEndingSoon
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
                )}
              >
                {parseInt(remaining.hours) > 0 ? (
                  <span>
                    {remaining.hours}:{remaining.minutes}:{remaining.seconds}
                  </span>
                ) : (
                  <span>
                    {remaining.minutes}:{remaining.seconds}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
