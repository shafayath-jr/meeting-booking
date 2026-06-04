"use client";

import {
  useGradientContext,
  type GradientVariant,
} from "@/components/providers/gradient-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBookingContext } from "./booking-context";
import BookingDatePicker from "./booking-date-picker";
import DurationSlots from "./duration-slots";
import MeetingDetailsForm from "./meeting-details-form";
import TimeSlots from "./time-slots";

const gradientMap: Record<GradientVariant, string> = {
  default: "gradient-mesh",
  available: "bg-linear-to-br from-[#F3F8FC] via-[#C2DDF0] to-[#8BBCD6]",
  "upcoming-soon": "bg-linear-to-br from-[#FFFFFF] via-[#E3CA78] to-[#EFB700]",
  ongoing: "gradient-grain bg-linear-to-t from-[#7F012E] via-[#C07090] to-[#FFFFFF]",
  unavailable: "gradient-grain bg-linear-to-t from-[#7F012E] via-[#C07090] to-[#FFFFFF]",
};

const borderColorMap: Record<GradientVariant, string> = {
  default: "#35AD57",
  available: "#6CADD5",
  "upcoming-soon": "#EFB700",
  ongoing: "oklch(56% 0.2 6)",
  unavailable: "oklch(56% 0.2 6)",
};

const badgeBgMap: Record<GradientVariant, string> = {
  default: "#0A8754",
  available: "#0A76B9",
  "upcoming-soon": "#8A5A00",
  ongoing: "oklch(25% 0.12 6)",
  unavailable: "oklch(25% 0.12 6)",
};

export default function BookingModal() {
  const { isModalOpen, isSubmitting, selectedDate, closeModal } = useBookingContext();
  const { variant } = useGradientContext();
  const [secondsLeft, setSecondsLeft] = useState(120);
  const deadlineRef = useRef<number | null>(null);

  const isAvailable = variant === "available" || variant === "default";
  const isOngoing = variant === "ongoing" || variant === "unavailable";
  const isUpcoming = variant === "upcoming-soon";
  const borderColor = borderColorMap[variant];
  const badgeBg = badgeBgMap[variant];

  useEffect(() => {
    if (!isModalOpen) {
      deadlineRef.current = null;
      const resetId = setTimeout(() => setSecondsLeft(120), 0);
      return () => clearTimeout(resetId);
    }

    if (!deadlineRef.current) {
      deadlineRef.current = Date.now() + 120_000;
    }

    const tick = () => {
      if (!deadlineRef.current) return;
      const remaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        closeModal();
      }
    };

    tick();
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [closeModal, isModalOpen]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent
        showCloseButton={false}
        className={`${gradientMap[variant]} max-h-[90vh] max-w-4xl! overflow-y-auto border!`}
        style={{ borderColor }}
      >
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <DialogTitle className="text-xl">Book a Meeting</DialogTitle>
            <div className="mr-8 flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[12px] font-semibold text-secondary shadow-sm">
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"
                aria-hidden="true"
              />
              <span className="tracking-[0.08em] text-black/90 uppercase">Time left</span>
              <span className="text-black/80 tabular-nums">{timerDisplay}</span>
            </div>
          </div>
        </DialogHeader>

        <Button
          asChild
          variant="transparent"
          size="icon-sm"
          className="absolute top-5 right-4 rounded-full"
        >
          <DialogClose>
            <XIcon className="text-[#07200E]" />
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
                  : isUpcoming
                    ? "border-[#EFB700]! bg-white! text-[#4A2F00] hover:bg-[#FFF8E5]! hover:text-[#4A2F00]! disabled:bg-white!"
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
