"use client";

import { useBookingContext } from "./booking-context";
import TimeSlots from "./time-slots";
import DurationSlots from "./duration-slots";
import MeetingDetailsForm from "./meeting-details-form";

export default function BookingSteps() {
  const { step } = useBookingContext();

  return (
    <div className="space-y-10">
      {step >= 1 && (
        <div className="space-y-6">
          <h5 className="text-2xl text-secondary">Available slots for today</h5>
          <TimeSlots />
        </div>
      )}

      {step >= 2 && (
        <div className="space-y-6">
          <h5 className="text-2xl text-secondary">Meeting durations</h5>
          <DurationSlots />
        </div>
      )}

      {step >= 3 && (
        <div>
          <MeetingDetailsForm />
        </div>
      )}
    </div>
  );
}
