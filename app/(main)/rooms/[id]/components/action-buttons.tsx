"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import QuickMeetingModal from "./quick-meeting-modal";

export default function ActionButtons() {
  const quickMeetingModal = useModal();
  return (
    <>
      <QuickMeetingModal
        isOpen={quickMeetingModal.isOpen}
        onClose={quickMeetingModal.handleClose}
      />
      <div className="flex items-center gap-4">
        <Button onClick={quickMeetingModal.handleOpen}>Quick meeting</Button>
        <Button>Book a meeting</Button>
        <Button>View calender</Button>
      </div>
    </>
  );
}
