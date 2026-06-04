"use client";

import {
  GradientVariant,
  useGradientContext,
} from "@/components/providers/gradient-context";
import { Meeting } from "@/types/meeting";
import { differenceInMinutes } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useBookingContext } from "./booking-section/booking-context";

function computeVariant(
  meetings: Meeting[],
  hasAvailableSlots: boolean
): GradientVariant {
  const now = new Date();
  const ongoing = meetings.find(
    (m) => new Date(m.start_time) <= now && new Date(m.end_time) > now
  );
  if (ongoing) return "ongoing";
  if (!hasAvailableSlots) return "unavailable";
  const upcoming = meetings
    .filter((m) => new Date(m.start_time) > now)
    .sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    )[0];
  if (upcoming && differenceInMinutes(new Date(upcoming.start_time), now) <= 30)
    return "upcoming-soon";
  return "available";
}

export default function RoomDebugPanel() {
  const params = useSearchParams();
  const debug = params.get("debug") === "1";
  const { meetings, hasAvailableSlots } = useBookingContext();
  const { variant } = useGradientContext();

  const nowIso = new Date().toISOString();
  const tzOffset = new Date().getTimezoneOffset();
  const sample = meetings[0];
  const parsedStart = sample?.start_time ? new Date(sample.start_time).toString() : "n/a";
  const parsedEnd = sample?.end_time ? new Date(sample.end_time).toString() : "n/a";

  const computed = useMemo(
    () => computeVariant(meetings, hasAvailableSlots),
    [meetings, hasAvailableSlots]
  );

  if (!debug) return null;

  return (
    <div className="fixed top-4 left-4 z-50 w-[360px] rounded-lg border border-black/10 bg-white/90 p-3 text-[12px] text-black shadow-sm">
      <div className="mb-2 font-semibold">Room Debug</div>
      <div>now: {nowIso}</div>
      <div>tz offset: {tzOffset}</div>
      <div>meetings: {meetings.length}</div>
      <div>hasAvailableSlots: {String(hasAvailableSlots)}</div>
      <div>variant (context): {variant}</div>
      <div>variant (computed): {computed}</div>
      <div className="mt-2 font-semibold">sample</div>
      <div>start_time: {sample?.start_time ?? "n/a"}</div>
      <div>end_time: {sample?.end_time ?? "n/a"}</div>
      <div>parsed start: {parsedStart}</div>
      <div>parsed end: {parsedEnd}</div>
    </div>
  );
}
