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
import { getPlaceById } from "@/actions/place";
import { addMinutes, format } from "date-fns";
import { bookMeeting } from "@/actions/meeting";

export default function QuickMeetingForm() {
  const { id: roomId } = useParams<{ id: string }>();

  const room = getRoomById(+roomId);
  const building = room?.placeId ? getPlaceById(room.placeId) : undefined;

  const form = useForm<QuickMeetingFormValues>({
    defaultValues: quickMeetingFormDefaultValues,
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: QuickMeetingFormValues) => {
    const startDate = new Date();
    const endDate = addMinutes(startDate, Number(data.duration));
    const date = startDate.toISOString();
    const end = endDate.toISOString();
    const time = format(startDate, "HH:mm:ss");

    const event = {
      title: data.name || "Quick meeting",
      start: date,
      end: end,
      time: time,
      duration: `${data.duration} minutes`,
      bookedBy: "Quick meeting",
      date: date,
      email: `Quick meeting`,
      guests: "",
      room: room?.name,
      building: building?.name,
    };

    const res = await bookMeeting(event);

    console.log(res);
  };

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
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                {MEETING_DURATION_OPTIONS.map((option, index) => (
                  <FieldLabel
                    key={index}
                    htmlFor={`duration-radiogroup-${index}`}
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
                      />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />

        <Field>
          <Button type="submit">Submit</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
