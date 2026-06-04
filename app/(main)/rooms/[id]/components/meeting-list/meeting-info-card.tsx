import { Card } from "@/components/ui/card";
import { Meeting } from "@/types/meeting";
import { format } from "date-fns";
import { Clock } from "lucide-react";

interface MeetingInfoCardProps {
  meeting: Meeting;
}

export default function MeetingInfoCard({ meeting }: MeetingInfoCardProps) {
  const startTime = format(new Date(meeting.start_time), "h:mm a");
  const endTime = format(new Date(meeting.end_time), "h:mm a");

  return (
    <Card className="gap-2 rounded-[12px] border border-[#CEE4F1] bg-[#f3f8fc80] px-4 py-6">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-sans text-[14px] leading-5 font-medium tracking-normal text-[#332802]">
          <Clock className="size-4.5" />
          {startTime}–{endTime}
        </span>
        <span className="rounded-full bg-[#0A76B9] px-2 py-1 font-sans text-[9px] leading-[14px] font-medium tracking-normal text-[#F3F8FC]">
          Upcoming
        </span>
      </div>
      <h3 className="mt-1.5 font-sans text-[14px] leading-5 font-medium tracking-normal text-[#06476F]">
        {meeting.title}
      </h3>
      <div className="flex items-center gap-2">
        <span className="font-sans text-[14px] leading-5 tracking-normal text-[#042F4A]">
          Host
        </span>
        <span className="truncate rounded-full border border-[#E2E8F0] bg-[#CDD6DC] px-2.5 py-1 text-[14px] leading-5 tracking-normal text-[#06476F]">
          {meeting.booked_by}
        </span>
      </div>
    </Card>
  );
}
