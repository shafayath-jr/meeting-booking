"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import QuickMeetingModal from "./quick-meeting-modal";
import BookMeetingModal from "./book-meeting-modal";
import { useSearchParams } from "next/navigation";
import { isToday, parseISO } from "date-fns";

export default function ActionButtons() {
  const quickMeetingModal = useModal();
  const bookMeetingModal = useModal();
  const searchParams = useSearchParams();

  const date = searchParams.get("date");
  const isTodayDate = date ? isToday(parseISO(date)) : true;

  return (
    <>
      <QuickMeetingModal
        isOpen={quickMeetingModal.isOpen}
        onClose={quickMeetingModal.handleClose}
      />
      <BookMeetingModal
        isOpen={bookMeetingModal.isOpen}
        onClose={bookMeetingModal.handleClose}
      />
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        {isTodayDate && (
          <Button
            onClick={quickMeetingModal.handleOpen}
            size="lg"
            className="w-full md:w-auto"
          >
            Quick meeting
          </Button>
        )}
        <Button
          onClick={bookMeetingModal.handleOpen}
          size="lg"
          className="w-full md:w-auto"
        >
          Book a meeting
        </Button>
      </div>
    </>
  );
}
