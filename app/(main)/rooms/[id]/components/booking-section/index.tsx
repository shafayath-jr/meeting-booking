import { getMeetingsByRoom } from "@/actions/meeting";
import { BookingProvider } from "./booking-context";
import BookingModal from "./booking-modal";
import BookNowButton from "./book-now-button";
import AvailabilityText from "./availability-text";
import SuccessBanner from "./success-banner";
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

        <SuccessBanner />

        <BookNowButton />
      </div>

      <BookingModal />
    </BookingProvider>
  );
}
