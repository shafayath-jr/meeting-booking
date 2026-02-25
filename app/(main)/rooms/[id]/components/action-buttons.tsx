"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import QuickMeetingModal from "./quick-meeting-modal";
import BookMeetingModal from "./book-meeting-modal";
import { useSearchParams } from "next/navigation";
import { isToday, parseISO } from "date-fns";
import { Zap, CalendarPlus } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
        {isTodayDate && (
          <Button
            onClick={quickMeetingModal.handleOpen}
            size="lg"
            className="glass-shadow w-full gap-2 bg-linear-to-r from-primary to-primary/80 transition-all duration-300 hover:scale-[1.02] hover:from-primary/90 hover:to-primary/70 active:scale-[0.98] md:w-auto"
          >
            <Zap className="h-4 w-4" />
            Quick meeting
          </Button>
        )}
        <Button
          onClick={bookMeetingModal.handleOpen}
          size="lg"
          className="glass-shadow w-full gap-2 bg-linear-to-r from-primary to-primary/80 transition-all duration-300 hover:scale-[1.02] hover:from-primary/90 hover:to-primary/70 active:scale-[0.98] md:w-auto"
        >
          <CalendarPlus className="h-4 w-4" />
          Book a meeting
        </Button>
      </div>
    </>
  );
}
