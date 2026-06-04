"use client";

import { useCurrentTime } from "@/hooks/use-current-time";
import { differenceInSeconds, format } from "date-fns";
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
  const remainingSeconds = Math.max(0, differenceInSeconds(endTime, now));
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const timeParts = [
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <p className="font-sans text-[18px] leading-6 tracking-normal text-[#475569]">
          Current Meeting
        </p>
        <h5 className="font-sans text-[24px] leading-9 font-semibold tracking-normal text-[#2D0808]">
          {ongoing.title}
        </h5>
        <p className="w-fit rounded-full bg-[#64748B] px-4 py-1.5 font-sans text-[18px] leading-[26px] font-medium tracking-normal text-[#F3F8FC]">
          {format(startTime, "h:mm a")} – {format(endTime, "h:mm a")}
        </p>
      </div>

      <div className="mt-15 rounded-[14px] border border-[#EE7D7D] bg-[#FDF2F233] px-4.25 py-6">
        <div className="flex flex-wrap justify-center gap-4">
          {timeParts.map((part) => (
            <div key={part.label} className="flex flex-col items-center gap-3">
              <div
                className="flex size-[90px] items-center justify-center text-[30px] leading-10 font-bold text-[#F3F8FC] tabular-nums"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #FFC7C7",
                  background: "linear-gradient(180deg, #520000 0%, #B61F1E 100%)",
                }}
              >
                {String(part.value).padStart(2, "0")}
              </div>
              <span className="font-sans text-[16px] leading-6 font-medium tracking-normal text-[#881717]">
                {part.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <p className="font-sans text-[14px] leading-5 font-medium tracking-normal text-[#F3F8FC]">
            Organized by:
          </p>
          <p className="font-sans text-[18px] leading-7 font-semibold tracking-normal text-[#F3F8FC]">
            {ongoing.booked_by}
          </p>
        </div>
      </div>
    </div>
  );
}
