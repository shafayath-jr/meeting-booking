import { getMeetingsByRoom } from "@/actions/meeting";
import { TIME_SLOTS } from "@/lib/constants";
import { isToday, isBefore, parse, addMinutes } from "date-fns";
import { BookingProvider } from "./booking-context";
import BookingSteps from "./booking-steps";
import BookNowButton from "./book-now-button";

type Props = {
  roomId: string;
};

export default async function BookingSection({ roomId }: Props) {
  const { meetings } = await getMeetingsByRoom(roomId);

  const now = new Date();
  const hasAvailableSlots = TIME_SLOTS.some((slot) => {
    const slotStart = parse(slot, "HH:mm", now);
    const slotEnd = addMinutes(slotStart, 30);
    if (isToday(now) && isBefore(slotStart, now)) return false;
    return !meetings?.some((m) => {
      const mStart = new Date(m.start_time);
      const mEnd = new Date(m.end_time);
      return slotStart < mEnd && slotEnd > mStart;
    });
  });

  return (
    <BookingProvider meetings={meetings ?? []}>
      <div className="space-y-10">
        <p className="text-sm font-semibold text-secondary">
          {hasAvailableSlots ? "Slots are available" : "No slots available"}
        </p>

        <BookingSteps />

        <div className="flex justify-center">
          <BookNowButton hasAvailableSlots={hasAvailableSlots} />
        </div>
      </div>
    </BookingProvider>
  );
}
