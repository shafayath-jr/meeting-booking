import { getMeetingsByRoom } from "@/actions/meeting";
import BookNowButton from "./book-now-button";
import TimeSlots from "./time-slots";
import DurationSlots from "./duration-slots";
import MeetingDetailsForm from "./meeting-details-form";

type Props = {
  roomId: string;
};

export default async function BookingSection({ roomId }: Props) {
  const { meetings } = await getMeetingsByRoom(roomId);

  return (
    <>
      {/* time slots */}
      <div className="space-y-6">
        <h5 className="text-2xl text-secondary">Available slots for today</h5>
        <TimeSlots meetings={meetings} />
      </div>

      {/* duration slot */}

      <div className="space-y-6">
        <h5 className="text-2xl text-secondary">Meeting durations</h5>
        <DurationSlots meetings={meetings ?? []} />
      </div>

      {/* meeting details */}

      <div>
        <MeetingDetailsForm />
      </div>

      {/* book now button */}
      <div className="flex justify-center">
        <BookNowButton />
      </div>
    </>
  );
}
