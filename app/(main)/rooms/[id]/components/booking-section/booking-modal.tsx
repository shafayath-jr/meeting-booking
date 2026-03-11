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
  const { isModalOpen, isSubmitting, closeModal } = useBookingContext();

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent
        showCloseButton={false}
        className="gradient-mesh max-h-[90vh] max-w-4xl! overflow-y-auto border! border-[#35AD57]!"
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

        <div className="space-y-10">
          <div className="relative mt-8 space-y-4 rounded-4xl border border-[#35AD57] p-4">
            <div className="absolute -top-6 left-6 rounded-full border border-[#35AD57] bg-[#0A8754] px-4 py-2">
              <h5 className="font-medium text-secondary">Available slots for today</h5>
            </div>
            <TimeSlots />
          </div>

          <div className="relative mt-8 space-y-4 rounded-4xl border border-[#35AD57] p-4">
            <div className="absolute -top-6 left-6 rounded-full border border-[#35AD57] bg-[#0A8754] px-4 py-2">
              <h5 className="font-medium text-secondary">Choose meeting duration</h5>
            </div>
            <DurationSlots />
          </div>

          <div className="relative mt-8 space-y-4 rounded-4xl border border-[#35AD57] p-4">
            <div className="absolute -top-6 left-6 rounded-full border border-[#35AD57] bg-[#0A8754] px-4 py-2">
              <h5 className="font-medium text-secondary">Booking details</h5>
            </div>

            <MeetingDetailsForm />
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            variant="outline"
            form="meeting-details-form"
            disabled={isSubmitting}
            className="rounded-xl border-secondary bg-transparent! px-8 py-6 text-secondary"
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
