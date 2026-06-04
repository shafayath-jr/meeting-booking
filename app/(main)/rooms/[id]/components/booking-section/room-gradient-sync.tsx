"use client";

import { useEffect } from "react";
import { differenceInMinutes } from "date-fns";
import { useBookingContext } from "./booking-context";
import {
  useGradientContext,
  GradientVariant,
} from "@/components/providers/gradient-context";
import { Meeting } from "@/types/meeting";

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

export default function RoomGradientSync() {
  const { todayMeetings, todayHasAvailableSlots } = useBookingContext();
  const { setVariant } = useGradientContext();

  useEffect(() => {
    setVariant(computeVariant(todayMeetings, todayHasAvailableSlots));

    const interval = setInterval(() => {
      setVariant(computeVariant(todayMeetings, todayHasAvailableSlots));
    }, 30_000);

    return () => {
      clearInterval(interval);
      setVariant("default");
    };
  }, [todayMeetings, todayHasAvailableSlots]);

  return null;
}
