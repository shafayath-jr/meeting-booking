"use client";

import { useState, useCallback } from "react";
import CalendarView from "./calendar-view";
import BookMeetingModal from "./book-meeting-modal";
import { BookingSlot } from "./calendar-view/types";

export default function CalendarWrapper() {
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

  return (
    <>
      <div className="max-w-7xl mx-auto border rounded-lg p-4 h-[80vh] md:h-[60vh] overflow-hidden">
        <CalendarView onSlotSelect={handleSlotSelect} />
      </div>
      <BookMeetingModal
        isOpen={isBookingModalOpen}
        onClose={handleBookingModalClose}
        prefillDate={bookingSlot?.date}
        prefillStartTime={bookingSlot?.startTime}
      />
    </>
  );
}
