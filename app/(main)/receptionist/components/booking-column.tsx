"use client";

import { CalendarClock } from "lucide-react";
import { useReceptionistBooking } from "./receptionist-booking-context";
import DatePicker from "./date-picker";
import SlotGrid from "./slot-grid";
import DurationGrid from "./duration-grid";
import MeetingForm from "./meeting-form";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative space-y-4 rounded-3xl border border-black/10 p-4 pt-7">
      <div className="absolute -top-3 left-5 rounded-xl border border-emerald-600 bg-[#d4e2db] px-3 py-1">
        <h5 className="text-xs font-medium text-emerald-600">{label}</h5>
      </div>
      {children}
    </div>
  );
}

export default function BookingColumn() {
  const { selectedRoomId, selectedTime } = useReceptionistBooking();

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#d4e2db] shadow-lg shadow-black/15">
      <div className="relative flex items-center gap-3 border-b border-black/10 px-5 py-5">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
          <CalendarClock className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            Book Meeting
          </h3>
        </div>
      </div>

      {!selectedRoomId ? (
        <div className="relative flex flex-1 items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <CalendarClock className="h-10 w-10 text-foreground/20" />
            <p className="max-w-3xs text-sm text-foreground/40">
              Select a room to choose a date and time
            </p>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 space-y-6 overflow-y-auto p-5">
          <Section label="Date">
            <DatePicker />
          </Section>

          <Section label="Available time slots">
            <SlotGrid />
          </Section>

          <Section label="Meeting duration">
            {selectedTime ? (
              <DurationGrid />
            ) : (
              <p className="text-sm text-foreground/50">
                Pick a time slot to choose duration.
              </p>
            )}
          </Section>

          <Section label="Meeting details">
            <MeetingForm />
          </Section>
        </div>
      )}
    </div>
  );
}
