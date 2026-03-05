import { getMeetingsByRoom } from "@/actions/meeting";
import { BookingProvider } from "./booking-context";
import BookingSteps from "./booking-steps";
import BookNowButton from "./book-now-button";
import AvailabilityText from "./availability-text";

type Props = {
  roomId: string;
};

export default async function BookingSection({ roomId }: Props) {
  const { meetings } = await getMeetingsByRoom(roomId);

  return (
    <BookingProvider roomId={roomId} initialMeetings={meetings ?? []}>
      <div className="space-y-10">
        <AvailabilityText />

        <BookingSteps />

        <div className="flex justify-center">
          <BookNowButton />
        </div>
      </div>
    </BookingProvider>
  );
}
