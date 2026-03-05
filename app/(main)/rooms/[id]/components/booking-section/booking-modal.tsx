"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBookingContext } from "./booking-context";
import TimeSlots from "./time-slots";
import DurationSlots from "./duration-slots";
import MeetingDetailsForm from "./meeting-details-form";

export default function BookingModal() {
  const { isModalOpen, closeModal } = useBookingContext();

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-h-[90vh] max-w-5xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Book a Meeting</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          <div className="space-y-4">
            <h5 className="text-lg font-medium">Available slots for today</h5>
            <TimeSlots />
          </div>

          <div className="space-y-4">
            <h5 className="text-lg font-medium">Meeting duration</h5>
            <DurationSlots />
          </div>

          <div className="space-y-4">
            <h5 className="text-lg font-medium">Meeting details</h5>
            <MeetingDetailsForm />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" form="meeting-details-form">
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
