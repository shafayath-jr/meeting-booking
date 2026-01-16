"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  quickMeetingFormDefaultValues,
  QuickMeetingFormValues,
} from "./form-schema";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MEETING_DURATION_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { getRoomById } from "@/actions/room";
import { addMinutes } from "date-fns";
import { bookMeeting, getNextMeetingByRoom } from "@/actions/meeting";
import { useEffect, useState } from "react";
import { Room } from "@/types/room";
import {
  calculateAvailableDurations,
  MeetingAvailability,
} from "@/lib/duration-helper";
import { toast } from "sonner";
import { useMeetingsContext } from "@/components/providers/meetings-provider";

type Props = {
  onClose: () => void;
};

export default function QuickMeetingForm({ onClose }: Props) {
  const { id: roomId } = useParams<{ id: string }>();
  const { triggerRefresh, refreshKey } = useMeetingsContext();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availability, setAvailability] = useState<MeetingAvailability>({
    isOngoingMeeting: false,
    availableMinutes: Infinity,
    enabledDurations: ["5", "10", "15"],
  });

  // Fetch data on mount and when refreshKey changes (real-time updates)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const { room } = await getRoomById(roomId);
      setRoom(room);

      const { meeting } = await getNextMeetingByRoom(roomId);
      const availabilityData = calculateAvailableDurations(meeting);
      setAvailability(availabilityData);
      setIsLoading(false);
    };

    fetchData();
  }, [roomId, refreshKey]);

  const form = useForm<QuickMeetingFormValues>({
    defaultValues: quickMeetingFormDefaultValues,
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: QuickMeetingFormValues) => {
    if (!room) return;

    const startDate = new Date();
    const endDate = addMinutes(startDate, Number(data.duration));
    const startTime = startDate.toISOString();
    const endTime = endDate.toISOString();

    const event = {
      title: data.name || "Quick meeting",
      start_time: startTime,
      end_time: endTime,
      date: startDate,
      booked_by: "Quick Meeting",
      email: "Quick Meeting",
      duration: `${data.duration} Minutes`,
      room_id: room.id,
      building_id: room.place_id,
    };

    const res = await bookMeeting(event);

    if (!res.error) {
      form.reset();
      triggerRefresh(); // Trigger real-time refresh across all components
      onClose();
      toast.success("Quick meeting booked successfully");
    } else {
      console.error(res.error);
      toast.error("Something went wrong!");
    }
  };

  if (isLoading) {
    return <div>Loading room details...</div>;
  }

  if (!room) {
    return <div>Room not found</div>;
  }

  return (
    <form id="quick-meeting-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Name <span>(optional)</span>
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                autoComplete="off"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="duration"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet>
              <FieldLegend variant="label">Duration</FieldLegend>

              {availability.isOngoingMeeting && (
                <p className="text-sm text-destructive mb-2">
                  There is an ongoing meeting. Please wait until it ends.
                </p>
              )}

              {!availability.isOngoingMeeting &&
                availability.availableMinutes !== Infinity &&
                availability.availableMinutes < 15 && (
                  <p className="text-sm text-yellow-600 mb-2">
                    Only {availability.availableMinutes} minutes available until
                    the next meeting.
                  </p>
                )}

              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                {MEETING_DURATION_OPTIONS.map((option, index) => {
                  const isDisabled = !availability.enabledDurations.includes(
                    option.value as "5" | "10" | "15"
                  );

                  return (
                    <FieldLabel
                      key={index}
                      htmlFor={`duration-radiogroup-${index}`}
                      className={
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }
                    >
                      <Field
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldTitle>{option.label}</FieldTitle>
                        </FieldContent>

                        <RadioGroupItem
                          value={option.value}
                          id={`duration-radiogroup-${index}`}
                          aria-invalid={fieldState.invalid}
                          disabled={isDisabled}
                        />
                      </Field>
                    </FieldLabel>
                  );
                })}
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />

        <Field>
          <Button
            type="submit"
            disabled={
              availability.isOngoingMeeting ||
              availability.enabledDurations.length === 0
            }
          >
            Submit
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
