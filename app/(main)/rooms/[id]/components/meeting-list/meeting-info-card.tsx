import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Meeting } from "@/types/meeting";

interface MeetingInfoCardProps {
  meeting: Meeting;
}

export default function MeetingInfoCard({ meeting }: MeetingInfoCardProps) {
  const startTime = format(new Date(meeting.start_time), "h:mm a");
  const endTime = format(new Date(meeting.end_time), "h:mm a");

  return (
    <Card className="space-y-2 rounded-2xl border border-blue-200 bg-blue-100 p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-xs font-semibold">
          <Clock className="size-4" />
          {startTime}–{endTime}
        </span>
        <span className="rounded-full bg-[#0A76B9] px-3 py-1 text-xs font-medium text-white">
          Upcoming
        </span>
      </div>
      <h3 className="text-lg leading-snug font-medium text-[#06476F]">{meeting.title}</h3>
      <div className="flex items-center gap-2 text-xs text-blue-900">
        <span className="font-medium">Host</span>
        <span className="truncate rounded-full bg-blue-200/70 px-3 py-1 font-medium">
          {meeting.booked_by}
        </span>
      </div>
    </Card>
  );
}
