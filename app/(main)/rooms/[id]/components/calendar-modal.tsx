"use client";

import { useState, useCallback } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import CalendarView from "./calendar-view";
import BookMeetingModal from "./book-meeting-modal";
import { BookingSlot } from "./calendar-view/types";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName?: string;
}

export default function CalendarModal({ isOpen, onClose, roomName }: CalendarModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [bookingSlot, setBookingSlot] = useState<BookingSlot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleSlotSelect = useCallback((slot: BookingSlot) => {
    setBookingSlot(slot);
    setIsBookingModalOpen(true);
  }, []);

  const handleBookingModalClose = useCallback(() => {
    setIsBookingModalOpen(false);
    setBookingSlot(null);
  }, []);

  const title = roomName ? `Calendar - ${roomName}` : "Calendar View";
  const description = "View room availability and book meetings";

  if (isDesktop) {
    return (
      <>
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="flex max-h-[90vh] max-w-5xl flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto py-4">
              <CalendarView onSlotSelect={handleSlotSelect} />
            </div>
          </DialogContent>
        </Dialog>

        <BookMeetingModal
          isOpen={isBookingModalOpen}
          onClose={handleBookingModalClose}
          prefillDate={bookingSlot?.date}
          prefillStartTime={bookingSlot?.startTime}
        />
      </>
    );
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-auto px-4 pb-4">
            <CalendarView onSlotSelect={handleSlotSelect} />
          </div>
        </DrawerContent>
      </Drawer>

      <BookMeetingModal
        isOpen={isBookingModalOpen}
        onClose={handleBookingModalClose}
        prefillDate={bookingSlot?.date}
        prefillStartTime={bookingSlot?.startTime}
      />
    </>
  );
}
