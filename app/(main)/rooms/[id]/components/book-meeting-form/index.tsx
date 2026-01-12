"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  bookMeetingFormDefaultValues,
  BookMeetingFormValues,
} from "./form-schema";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useSearchParams } from "next/navigation";
import { getRoomById } from "@/actions/room";
import {
  addMinutes,
  areIntervalsOverlapping,
  format,
  isBefore,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import { bookMeeting, getMeetingsByRoom } from "@/actions/meeting";
import { useEffect, useMemo, useState } from "react";
import { Room } from "@/types/room";
import { getAllDomains } from "@/actions/domain";
import { Domain } from "@/types/domain";
import { Meeting } from "@/types/meeting";
import { toast } from "sonner";
import { CalendarIcon, CirclePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FULL_MEETING_DURATION_OPTIONS, TIME_SLOTS } from "@/lib/constants";

type Props = {
  onClose: () => void;
};

export default function BookMeetingForm({ onClose }: Props) {
  const { id: roomId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestInput, setGuestInput] = useState("");

  const defaultDate = useMemo(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      try {
        const parsedDate = parseISO(dateParam);

        if (!isNaN(parsedDate.getTime()) && parsedDate >= startOfToday()) {
          return parsedDate;
        }
      } catch {}
    }
    return new Date();
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [{ room }, { domains: fetchedDomains }] = await Promise.all([
        getRoomById(roomId),
        getAllDomains(),
      ]);
      setRoom(room);
      setDomains(fetchedDomains || []);
      setIsLoading(false);
    };

    fetchData();
  }, [roomId]);

  const form = useForm<BookMeetingFormValues>({
    defaultValues: {
      ...bookMeetingFormDefaultValues,
      date: defaultDate,
    },
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "guests",
  });

  const selectedDate = form.watch("date");
  const selectedDuration = form.watch("duration");

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!selectedDate) return;

      const { meetings: fetchedMeetings } = await getMeetingsByRoom(
        roomId,
        selectedDate.toISOString()
      );
      setMeetings(fetchedMeetings || []);
    };

    fetchMeetings();
  }, [selectedDate, roomId]);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) {
      return TIME_SLOTS;
    }

    const now = new Date();
    const isTodayDate = isToday(selectedDate);
    const durationMinutes = selectedDuration ? Number(selectedDuration) : 15;

    return TIME_SLOTS.filter((timeSlot) => {
      // Parse the time slot into a Date object
      const slotStartTime = parse(timeSlot, "HH:mm", selectedDate);

      // Filter out past time slots for today
      if (isTodayDate && isBefore(slotStartTime, now)) {
        return false;
      }

      const slotEndTime = addMinutes(slotStartTime, durationMinutes);

      const hasConflict = meetings.some((meeting) => {
        return areIntervalsOverlapping(
          { start: slotStartTime, end: slotEndTime },
          {
            start: new Date(meeting.start_time),
            end: new Date(meeting.end_time),
          }
        );
      });

      return !hasConflict;
    });
  }, [selectedDate, meetings, selectedDuration]);

  const onSubmit = async (data: BookMeetingFormValues) => {
    if (!room) return;

    setIsSubmitting(true);

    try {
      const [hours, minutes] = data.startTime.split(":");
      const startDate = new Date(data.date);
      startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endDate = addMinutes(startDate, Number(data.duration));
      const startTime = startDate.toISOString();
      const endTime = endDate.toISOString();

      const email = `${data.emailUsername}@${data.emailDomain}`;

      const guestEmails = data.guests?.map((g) => g.value) || [];

      const event = {
        title: data.name,
        start_time: startTime,
        end_time: endTime,
        date: startDate,
        booked_by: data.name,
        email: email,
        duration: `${data.duration} Minutes`,
        guests: JSON.stringify(guestEmails),
        room_id: room.id,
        building_id: room.place_id,
      };

      const res = await bookMeeting(event);

      if (!res.error) {
        form.reset();
        onClose();
        toast.success("Meeting booked successfully");
      } else {
        console.error(res.error);
        toast.error(res.error || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading room details...</div>;
  }

  if (!room) {
    return <div>Room not found</div>;
  }

  return (
    <form id="book-meeting-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FieldGroup>
          {/* Title */}

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder=""
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Email */}

        <FieldGroup className="grid md:grid-cols-2 gap-4">
          {/* Email Username */}

          <Controller
            name="emailUsername"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                </FieldContent>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder="Username"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Email Domain */}

          <Controller
            name="emailDomain"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  {/* <FieldLabel htmlFor={field.name}></FieldLabel> */}
                </FieldContent>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-inherit">@</span>
                      <SelectValue placeholder="Select domain" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map((domain) => (
                      <SelectItem key={domain.id} value={domain.name}>
                        {domain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup className="grid md:grid-cols-2 gap-4">
          {/* Date */}

          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="date">Date</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < startOfToday()}
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Start Time */}

          <Controller
            name="startTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Start Time</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-slots" disabled>
                        No slots available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Duration */}

        <FieldGroup>
          <Controller
            name="duration"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Duration</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {FULL_MEETING_DURATION_OPTIONS.map((duration, index) => (
                      <SelectItem key={index} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* Guests */}

        <FieldGroup>
          <Field>
            <FieldLabel>
              Guests <span>(optional)</span>
            </FieldLabel>

            <InputGroup>
              <InputGroupInput
                value={guestInput}
                onChange={(e) => setGuestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (guestInput.trim()) {
                      append({ value: guestInput.trim() });
                      setGuestInput("");
                    }
                  }
                }}
                autoComplete="off"
                placeholder="Enter guest email"
              />

              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  aria-label="Add"
                  title="Add"
                  size="icon-xs"
                  onClick={() => {
                    if (guestInput.trim()) {
                      append({ value: guestInput.trim() });
                      setGuestInput("");
                    }
                  }}
                  type="button"
                >
                  <CirclePlus />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            {fields.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {fields.map((field, index) => (
                  <Badge
                    key={field.id}
                    variant="secondary"
                    className="gap-1.5 pr-1"
                  >
                    <span>{field.value}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remove(index)}
                      className="h-4 w-4 rounded-sm hover:bg-secondary-foreground/20"
                      aria-label={`Remove ${field.value}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </Field>
        </FieldGroup>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Booking..." : "Book Meeting"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
