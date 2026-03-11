import BookingModal from "./booking-modal";
import BookNowButton from "./book-now-button";
import AvailabilityText from "./availability-text";
import SuccessBanner from "./success-banner";
import OngoingMeetingBanner from "./ongoing-meeting-banner";
import RoomGradientSync from "./room-gradient-sync";

export default function BookingSection() {
  return (
    <>
      <RoomGradientSync />
      <div className="space-y-10">
        <OngoingMeetingBanner />
        <AvailabilityText />

        <SuccessBanner />

        <BookNowButton />
      </div>

      <BookingModal />
    </>
  );
}
