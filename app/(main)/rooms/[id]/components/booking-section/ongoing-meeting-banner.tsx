"use client";

import { format, differenceInSeconds } from "date-fns";
import { useCurrentTime } from "@/hooks/use-current-time";
import { useBookingContext } from "./booking-context";

export default function OngoingMeetingBanner() {
  const { meetings, showSuccess } = useBookingContext();
  const now = useCurrentTime(1000);

  const ongoing = meetings.find(
    (m) => new Date(m.start_time) <= now && new Date(m.end_time) > now
  );

  if (showSuccess) return null;
  if (!ongoing) return null;

  const startTime = new Date(ongoing.start_time);
  const endTime = new Date(ongoing.end_time);
  const totalSeconds = differenceInSeconds(endTime, startTime);
  const remainingSeconds = Math.max(0, differenceInSeconds(endTime, now));
  const elapsedSeconds = totalSeconds - remainingSeconds;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (elapsedSeconds / totalSeconds);

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeDisplay = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <p className="text-lg text-secondary">Current Meeting</p>
        <h5 className="text-4xl font-semibold text-secondary">{ongoing.title}</h5>
        <p className="text-xl text-secondary">
          {format(startTime, "h:mm a")} – {format(endTime, "h:mm a")}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="relative flex size-[140px] items-center justify-center">
          <svg width="140" height="140" className="-rotate-90" aria-hidden="true">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="6"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              style={{ transition: "stroke-dashoffset 0.5s linear" }}
            />
          </svg>
          <span className="absolute text-2xl font-semibold text-secondary tabular-nums">
            {timeDisplay}
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-secondary/80">
        Organized by:{" "}
        <span className="font-semibold text-secondary">{ongoing.booked_by}</span>
      </p>
    </div>
  );
}
