"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import QuickMeetingModal from "./quick-meeting-modal";
import { useSearchParams } from "next/navigation";
import { isToday, parseISO } from "date-fns";

export default function ActionButtons() {
  const quickMeetingModal = useModal();
  const searchParams = useSearchParams();

  const date = searchParams.get("date");
  const isTodayDate = date ? isToday(parseISO(date)) : true;

  return (
    <>
      <QuickMeetingModal
        isOpen={quickMeetingModal.isOpen}
        onClose={quickMeetingModal.handleClose}
      />
      <div className="flex items-center gap-4">
        {isTodayDate && (
          <Button onClick={quickMeetingModal.handleOpen}>Quick meeting</Button>
        )}
        <Button>Book a meeting</Button>
        <Button>View calender</Button>
      </div>
    </>
  );
}
