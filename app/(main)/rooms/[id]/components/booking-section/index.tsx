import { getMeetingsByRoom } from "@/actions/meeting";
import { BookingProvider } from "./booking-context";
import BookingSteps from "./booking-steps";
import BookNowButton from "./book-now-button";
import AvailabilityText from "./availability-text";
import RoomGradientSync from "./room-gradient-sync";

type Props = {
  roomId: string;
};

export default async function BookingSection({ roomId }: Props) {
  const { meetings } = await getMeetingsByRoom(roomId);

  return (
    <BookingProvider roomId={roomId} initialMeetings={meetings ?? []}>
      <RoomGradientSync />
      <div className="space-y-10">
        <AvailabilityText />

        <BookingSteps />

        <div className="flex justify-start">
          <BookNowButton />
        </div>
      </div>
    </BookingProvider>
  );
}
