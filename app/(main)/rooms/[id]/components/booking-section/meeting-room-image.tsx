"use client";

import Image from "next/image";
import { useCurrentTime } from "@/hooks/use-current-time";
import { useBookingContext } from "./booking-context";

export default function MeetingRoomImage() {
  const { meetings, showSuccess } = useBookingContext();
  const now = useCurrentTime(1000);

  const hasOngoing = meetings.some(
    (m) => new Date(m.start_time) <= now && new Date(m.end_time) > now
  );

  if (showSuccess || hasOngoing) return null;

  return (
    <Image
      src="/meeting-room-image.webp"
      alt="Meeting Room"
      width={480}
      height={190}
      className="h-60 w-lg rounded-lg object-cover"
    />
  );
}
