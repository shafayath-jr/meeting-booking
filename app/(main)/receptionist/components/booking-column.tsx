"use client";

import { CalendarClock } from "lucide-react";
import { useReceptionistBooking } from "./receptionist-booking-context";
import DatePicker from "./date-picker";
import SlotGrid from "./slot-grid";
import DurationGrid from "./duration-grid";
import MeetingForm from "./meeting-form";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative space-y-4 rounded-3xl border border-emerald-900/40 p-4 pt-7">
      <div className="absolute -top-3 left-5 rounded-full border border-emerald-900/40 bg-[#0A8754] px-3 py-1">
        <h5 className="text-xs font-medium text-secondary">{label}</h5>
      </div>
      {children}
    </div>
  );
}

export default function BookingColumn() {
  const { selectedRoomId, selectedTime } = useReceptionistBooking();

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-900/40 bg-linear-to-br from-[#102016] to-[#1E633A]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
          <CalendarClock className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-tight text-secondary">
            Book Meeting
          </h3>
        </div>
      </div>

      {!selectedRoomId ? (
        <div className="relative flex flex-1 items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <CalendarClock className="h-10 w-10 text-white/20" />
            <p className="max-w-3xs text-sm text-white/40">
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
              <p className="text-sm text-white/50">
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
