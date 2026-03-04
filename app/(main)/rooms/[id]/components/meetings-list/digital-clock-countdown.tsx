"use client";

import { cn, getCountdown } from "@/lib/utils";
import { useCurrentTime } from "@/hooks/use-current-time";

interface DigitalClockCountdownProps {
  meetingStart: Date;
}

export default function DigitalClockCountdown({
  meetingStart,
}: DigitalClockCountdownProps) {
  const currentTime = useCurrentTime();
  const countdown = getCountdown(meetingStart, currentTime);
  if (!countdown) return null;

  const isSoon = countdown.totalMinutes < 60;

  return (
    <div
      className={cn(
        "min-w-[100px] shrink-0 rounded-lg px-3 py-2 transition-all",
        isSoon ? "bg-destructive/10" : "bg-primary/10"
      )}
    >
      <div className="text-center">
        <div className="mb-0.5 text-[9px] font-medium tracking-wider text-muted-foreground uppercase">
          {isSoon ? "Starting in" : "Starts in"}
        </div>
        <div
          className={cn(
            "font-mono text-base leading-none font-bold",
            isSoon ? "text-destructive" : "text-primary"
          )}
        >
          {countdown.days > 0 ? (
            <div className="space-y-0.5">
              <div>{countdown.days}d</div>
              <div className="text-xs">
                {countdown.hours}:{countdown.minutes}:{countdown.seconds}
              </div>
            </div>
          ) : parseInt(countdown.hours) > 0 ? (
            <div>
              {countdown.hours}:{countdown.minutes}:{countdown.seconds}
            </div>
          ) : (
            <div>
              {countdown.minutes}:{countdown.seconds}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
