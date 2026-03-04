import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Meeting } from "@/types/meeting";

interface MeetingInfoCardProps {
  meeting: Meeting;
  status: "Upcoming" | "Ongoing";
}

export default function MeetingInfoCard({ meeting, status }: MeetingInfoCardProps) {
  const startTime = format(new Date(meeting.start_time), "h:mma");
  const endTime = format(new Date(meeting.end_time), "h:mma");

  return (
    <Card className="gap-0 border-none bg-black/20 px-5 py-4 text-white">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">
          {startTime}–{endTime} ({meeting.duration})
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs text-white ${
            status === "Ongoing" ? "bg-emerald-600" : "bg-brand-green"
          }`}
        >
          {status}
        </span>
      </div>
      <h3 className="mt-1 text-lg font-semibold">{meeting.title}</h3>
      <p className="mt-0.5 text-sm text-white/70">
        <span className="font-medium text-white">Meeting Host</span> : {meeting.booked_by}
      </p>
    </Card>
  );
}
