"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { differenceInMinutes, format } from "date-fns";
import { BadgeCheck } from "lucide-react";
import { useEffect } from "react";
import { useBookingContext } from "./booking-context";

export default function SuccessBanner() {
  const { successData, resetFlow } = useBookingContext();

  useEffect(() => {
    if (!successData) return;

    const timer = setTimeout(resetFlow, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [resetFlow]);

  if (!successData) return null;

  const { subject, hostName, startTime, endTime } = successData;
  const minsLeft = differenceInMinutes(startTime, new Date());
  const timeRange = `${format(startTime, "h:mma")}–${format(endTime, "h:mma")}`;

  const timeUntilStart = (() => {
    if (minsLeft <= 0) return null;
    const hrs = Math.floor(minsLeft / 60);
    const mins = minsLeft % 60;
    if (hrs > 0 && mins > 0) return `${hrs} hr ${mins} min`;
    if (hrs > 0) return `${hrs} hr${hrs !== 1 ? "s" : ""}`;
    return `${mins} min${mins !== 1 ? "s" : ""}`;
  })();

  return (
    <Dialog open={!!successData} onOpenChange={(open) => (!open ? resetFlow() : null)}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[666px]! overflow-hidden rounded-[32px] border border-[#0A76B9] p-8 text-[#F3F8FC]"
        style={{ backgroundColor: "#085E94" }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <BadgeCheck className="size-14 text-[#9DC8E3]" strokeWidth={1.5} />
          <h3 className="font-sans text-[24px] leading-9 font-semibold tracking-normal text-[#F3F8FC]">
            Successfully Completed
          </h3>
          <p className="text-[18px] leading-6 tracking-normal text-[#F3F8FC]">
            Meeting Details
          </p>
        </div>

        <div className="mt-6 grid gap-y-6 text-white/90 sm:grid-cols-2 sm:gap-x-0">
          <div className="space-y-2 sm:pr-6">
            <p className="text-[16px] leading-6 tracking-normal text-[#9DC8E3]">
              Meeting Subject:
            </p>
            <p className="text-[18px] font-medium tracking-normal break-words text-[#F3F8FC]">
              {subject}
            </p>
          </div>
          <div className="space-y-2 sm:border-l sm:border-white/15 sm:pl-6">
            <p className="text-[16px] leading-6 tracking-normal text-wrap text-[#9DC8E3]">
              Meeting Host:
            </p>
            <p className="text-[18px] font-medium tracking-normal break-words text-[#F3F8FC]">
              {hostName}
            </p>
          </div>
          <div className="space-y-2 sm:pr-6">
            <p className="text-[16px] leading-6 tracking-normal text-[#9DC8E3]">
              Meeting Date:
            </p>
            <p className="inline-flex items-center rounded-full bg-[#3B91C7] px-3 py-1 text-[18px] leading-[26px] font-medium tracking-normal whitespace-nowrap text-[#F3F8FC]">
              {format(startTime, "EEEE")}
            </p>
          </div>
          <div className="space-y-2 sm:border-l sm:border-white/15 sm:pl-6">
            <p className="text-[16px] leading-6 tracking-normal text-[#9DC8E3]">
              Meeting Time:
            </p>
            <p className="inline-flex items-center rounded-full bg-[#688597] px-3 py-1 text-[18px] leading-[26px] font-medium tracking-normal whitespace-nowrap text-[#F3F8FC]">
              {timeRange}
            </p>
          </div>
        </div>

        {timeUntilStart && (
          <p className="mt-6 text-center font-sans text-[18px] leading-[26px] font-medium tracking-normal text-[#FEC909]">
            You have {timeUntilStart} left for the meeting
          </p>
        )}

        <Button
          variant="transparent"
          className="mt-8 w-full rounded-xl border border-white/40 py-6 text-white"
          onClick={resetFlow}
        >
          Book a New Meeting
        </Button>
      </DialogContent>
    </Dialog>
  );
}
