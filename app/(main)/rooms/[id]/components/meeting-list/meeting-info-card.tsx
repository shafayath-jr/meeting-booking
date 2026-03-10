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
    <Card className="text-seconodary gap-0 rounded-xl border-2 border-secondary/10 bg-secondary/10 px-5 py-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-secondary">
          {startTime}–{endTime} ({meeting.duration})
        </span>
        <span
          className={`rounded-full bg-linear-to-b from-[#25A048] to-[#1F7738] px-2 py-1 text-xs font-semibold text-secondary ${
            status === "Ongoing" ? "bg-emerald-600" : "bg-brand-green"
          }`}
        >
          {status}
        </span>
      </div>
      <h3 className="mt-1 text-lg font-medium text-secondary">{meeting.title}</h3>
      <p className="mt-0.5 text-xs text-secondary">
        <span className="font-semibold text-white">Meeting Host</span> :{" "}
        {meeting.booked_by}
      </p>
      {status === "Ongoing" && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-white/70">{countdownText}</p>
        </div>
      )}
    </Card>
  );
}
