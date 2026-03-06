"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  meetingDetailsFormDefaultValues,
  MeetingDetailsFormValues,
} from "./form-schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import { getRoomById } from "@/actions/room";
import { getAllDomains } from "@/actions/domain";
import { bookMeeting } from "@/actions/meeting";
import { useEffect, useState } from "react";
import { addMinutes, parse } from "date-fns";
import { Domain } from "@/types/domain";
import { Room } from "@/types/room";
import { toast } from "sonner";
import { useMeetingsContext } from "@/components/providers/meetings-provider";
import { useBookingContext } from "../booking-context";

export default function MeetingDetailsForm() {
  const { id: roomId } = useParams<{ id: string }>();
  const { triggerRefresh } = useMeetingsContext();
  const { selectedTime, selectedDuration, setBookingSuccess, closeModal } =
    useBookingContext();

  const [domains, setDomains] = useState<Domain[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [{ domains: fetchedDomains }, { room: fetchedRoom }] = await Promise.all([
        getAllDomains(),
        getRoomById(roomId),
      ]);
      setDomains(fetchedDomains || []);
      setRoom(fetchedRoom);
    };
    fetchData();
  }, [roomId]);

  const form = useForm<MeetingDetailsFormValues>({
    defaultValues: meetingDetailsFormDefaultValues,
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: MeetingDetailsFormValues) => {
    if (!room || !selectedTime || !selectedDuration) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
      const startDate = parse(selectedTime, "HH:mm", now);
      const endDate = addMinutes(startDate, Number(selectedDuration));

      const event = {
        title: data.subject,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        date: startDate,
        booked_by: data.hostName,
        email: `${data.emailUsername}@${data.emailDomain}`,
        duration: `${selectedDuration} Minutes`,
        guests: JSON.stringify([]),
        room_id: room.id,
        building_id: room.place_id,
      };

      const res = await bookMeeting(event);

      if (!res.error) {
        form.reset();
        triggerRefresh();
        closeModal();
        setBookingSuccess({
          subject: data.subject,
          hostName: data.hostName,
          startTime: startDate,
          endTime: endDate,
        });
      } else {
        toast.error(res.error || "Something went wrong!");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="meeting-details-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-2 gap-4">
        <Controller
          name="subject"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-lg text-secondary">
                Meeting Subject
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                placeholder="Enter what the meeting is about"
                className="border-secondary bg-transparent text-secondary/90 placeholder:text-secondary/90 hover:bg-transparent focus-visible:border-secondary/50 focus-visible:bg-transparent focus-visible:ring-secondary/20"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="hostName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-lg text-secondary">
                Meeting Host Name
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your name"
                className="border-secondary bg-transparent text-secondary/90 placeholder:text-secondary/90 hover:bg-transparent focus-visible:border-secondary/50 focus-visible:bg-transparent focus-visible:ring-secondary/20"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="emailUsername"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-lg text-secondary">
                Email Username
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                placeholder="Username"
                className="border-secondary bg-transparent text-secondary/90 placeholder:text-secondary/90 hover:bg-transparent focus-visible:border-secondary/50 focus-visible:bg-transparent focus-visible:ring-secondary/20"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="emailDomain"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-lg text-secondary">
                Email Domain
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className="w-full border-secondary bg-transparent text-secondary/90!"
                  aria-invalid={fieldState.invalid}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-inherit">@</span>
                    <SelectValue placeholder="Select domain" />
                  </div>
                </SelectTrigger>
                <SelectContent className="text-secondary">
                  {domains.map((domain) => (
                    <SelectItem key={domain.id} value={domain.name}>
                      {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
