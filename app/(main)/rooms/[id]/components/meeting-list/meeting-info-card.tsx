import { Card } from "@/components/ui/card";

const meeting = {
  startTime: "3:00pm",
  endTime: "4:00pm",
  duration: "1 hour",
  title: "Strategic Alignment Meeting",
  host: "Dumitru Radu Chirca",
  status: "Upcoming",
};

export default function MeetingInfoCard() {
  return (
    <Card className="gap-0 border-none bg-black/20 px-5 py-4 text-white">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">
          {meeting.startTime}–{meeting.endTime} ({meeting.duration})
        </span>
        <span className="rounded-full bg-brand-green px-2 py-0.5 text-xs text-white">
          {meeting.status}
        </span>
      </div>
      <h3 className="mt-1 text-lg font-semibold">{meeting.title}</h3>
      <p className="mt-0.5 text-sm text-white/70">
        <span className="font-medium text-white">Meeting Host</span> : {meeting.host}
      </p>
    </Card>
  );
}
