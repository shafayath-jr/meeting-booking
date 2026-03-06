"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { useBookingContext } from "./booking-context";
import TimeSlots from "./time-slots";
import DurationSlots from "./duration-slots";
import MeetingDetailsForm from "./meeting-details-form";

export default function BookingModal() {
  const { isModalOpen, closeModal } = useBookingContext();

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent
        showCloseButton={false}
        className="gradient-mesh max-h-[90vh] max-w-4xl! overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-secondary">Book a Meeting</DialogTitle>
        </DialogHeader>

        <Button
          asChild
          variant="transparent"
          size="icon-sm"
          className="absolute top-4 right-4 rounded-full"
        >
          <DialogClose>
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogClose>
        </Button>

        <div className="space-y-8">
          <div className="space-y-4">
            <h5 className="text-lg font-medium text-secondary">
              Available slots for today
            </h5>
            <TimeSlots />
          </div>

          <div className="space-y-4">
            <h5 className="text-lg font-medium text-secondary">Meeting duration</h5>
            <DurationSlots />
          </div>

          <div className="space-y-4">
            <MeetingDetailsForm />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="transparent" form="meeting-details-form">
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
