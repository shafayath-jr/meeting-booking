"use client";

import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Meeting } from "@/types/meeting";
import { useCurrentTime } from "@/hooks/use-current-time";
import { getRemainingTime, getProgress } from "@/lib/utils";

interface MeetingInfoCardProps {
  meeting: Meeting;
  status: "Upcoming" | "Ongoing";
}

export default function MeetingInfoCard({ meeting, status }: MeetingInfoCardProps) {
  const startTime = format(new Date(meeting.start_time), "h:mma");
  const endTime = format(new Date(meeting.end_time), "h:mma");

  const liveTime = useCurrentTime(1000);
  const progress = status === "Ongoing" ? getProgress(meeting, liveTime) : 0;
  const remaining =
    status === "Ongoing" ? getRemainingTime(new Date(meeting.end_time), liveTime) : null;

  const countdownText = remaining
    ? remaining.hours !== "00"
      ? `${remaining.hours}h ${remaining.minutes}m ${remaining.seconds}s remaining`
      : `${remaining.minutes}m ${remaining.seconds}s remaining`
    : null;

  return (
    <Card className="gap-0 rounded-xl border border-white/10 bg-white/8 px-5 py-5 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-mono text-sm font-medium tracking-wide text-brand-yellow">
          {startTime} — {endTime}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase ${
            status === "Ongoing"
              ? "bg-emerald-600/70 ring-1 ring-emerald-500/30"
              : "bg-emerald-800/70 ring-1 ring-emerald-600/20"
          }`}
        >
          {status}
        </span>
      </div>
      <h3 className="mb-1 text-base leading-snug font-semibold text-secondary">
        {meeting.title}
      </h3>
      <p className="text-xs text-white/40">
        <span className="font-medium text-white/55">Host</span> {meeting.booked_by}
      </p>
      {status === "Ongoing" && (
        <div className="mt-4">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-white/40">{countdownText}</p>
        </div>
      )}
    </Card>
  );
}
