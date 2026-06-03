"use client";

import { isToday, format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingContext } from "./booking-context";
import TimeSlots from "./time-slots";
import DurationSlots from "./duration-slots";
import MeetingDetailsForm from "./meeting-details-form";
import BookingDatePicker from "./booking-date-picker";
import {
  useGradientContext,
  type GradientVariant,
} from "@/components/providers/gradient-context";

const gradientMap: Record<GradientVariant, string> = {
  default: "gradient-mesh",
  available: "bg-linear-to-br from-[#F3F8FC] via-[#C2DDF0] to-[#8BBCD6]",
  "upcoming-soon": "gradient-standby",
  ongoing: "gradient-grain bg-linear-to-t from-[#7F012E] via-[#C07090] to-[#FFFFFF]",
  unavailable: "gradient-grain bg-linear-to-t from-[#7F012E] via-[#C07090] to-[#FFFFFF]",
};

const borderColorMap: Record<GradientVariant, string> = {
  default: "#35AD57",
  available: "#6CADD5",
  "upcoming-soon": "oklch(65.438% 0.14546 57.442)",
  ongoing: "oklch(56% 0.2 6)",
  unavailable: "oklch(56% 0.2 6)",
};

const badgeBgMap: Record<GradientVariant, string> = {
  default: "#0A8754",
  available: "#0A76B9",
  "upcoming-soon": "oklch(35% 0.1 57)",
  ongoing: "oklch(25% 0.12 6)",
  unavailable: "oklch(25% 0.12 6)",
};

export default function BookingModal() {
  const { isModalOpen, isSubmitting, selectedDate, closeModal } = useBookingContext();
  const { variant } = useGradientContext();

  const isAvailable = variant === "available" || variant === "default";
  const isOngoing = variant === "ongoing" || variant === "unavailable";
  const borderColor = borderColorMap[variant];
  const badgeBg = badgeBgMap[variant];

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent
        showCloseButton={false}
        className={`${gradientMap[variant]} max-h-[90vh] max-w-4xl! overflow-y-auto border!`}
        style={{ borderColor }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Book a Meeting</DialogTitle>
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
          <div
            className="relative mt-8 space-y-4 rounded-4xl border p-4"
            style={{ borderColor }}
          >
            <div
              className="absolute -top-6 left-6 rounded-full border px-4 py-2"
              style={{ borderColor, backgroundColor: badgeBg }}
            >
              <h5 className="font-medium text-secondary">Select date</h5>
            </div>
            <div className="mt-2">
              <BookingDatePicker />
            </div>
          </div>

          <div
            className="relative mt-8 space-y-4 rounded-4xl border p-4"
            style={{ borderColor }}
          >
            <div
              className="absolute -top-6 left-6 rounded-full border px-4 py-2"
              style={{ borderColor, backgroundColor: badgeBg }}
            >
              <h5 className="font-medium text-secondary">
                {isToday(selectedDate)
                  ? "Available slots for today"
                  : `Available slots for ${format(selectedDate, "EEE, MMM d")}`}
              </h5>
            </div>
            <TimeSlots />
          </div>

          <div
            className="relative mt-8 space-y-4 rounded-4xl border p-4"
            style={{ borderColor }}
          >
            <div
              className="absolute -top-6 left-6 rounded-full border px-4 py-2"
              style={{ borderColor, backgroundColor: badgeBg }}
            >
              <h5 className="font-medium text-secondary">Choose meeting duration</h5>
            </div>
            <DurationSlots />
          </div>

          <div
            className="relative mt-8 space-y-4 rounded-4xl border p-4"
            style={{ borderColor }}
          >
            <div
              className="absolute -top-6 left-6 rounded-full border px-4 py-2"
              style={{ borderColor, backgroundColor: badgeBg }}
            >
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
            className={cn(
              "rounded-xl px-8 py-6",
              isAvailable
                ? "border-[#6CADD5]! bg-white! text-[#06476F] hover:bg-[#F3F8FC]! hover:text-[#06476F]! disabled:bg-white!"
                : isOngoing
                  ? "border-[#C07090]! bg-white! text-[#2D0808] hover:bg-white/90! hover:text-[#2D0808]! disabled:bg-white!"
                  : "border-secondary bg-white! text-secondary hover:bg-white/90! disabled:bg-white!"
            )}
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
