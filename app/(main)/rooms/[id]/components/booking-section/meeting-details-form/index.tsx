"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  meetingDetailsFormDefaultValues,
  MeetingDetailsFormValues,
} from "./form-schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useParams } from "next/navigation";
import { getRoomById } from "@/actions/room";
import { searchUsers } from "@/actions/user";
import { bookMeeting } from "@/actions/meeting";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { addMinutes, parse } from "date-fns";
import { User } from "@/types/user";
import { Room } from "@/types/room";
import { toast } from "sonner";
import { cn, nameFromEmail } from "@/lib/utils";
import { useMeetingsContext } from "@/components/providers/meetings-provider";
import { useBookingContext } from "../booking-context";
import { useGradientContext } from "@/components/providers/gradient-context";

export default function MeetingDetailsForm() {
  const { variant } = useGradientContext();
  const isAvailable = variant === "available" || variant === "default";
  const { id: roomId } = useParams<{ id: string }>();
  const { triggerRefresh } = useMeetingsContext();
  const {
    selectedDate,
    selectedTime,
    selectedDuration,
    setBookingSuccess,
    closeModal,
    setIsSubmitting,
  } = useBookingContext();

  const [room, setRoom] = useState<Room | null>(null);
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const [guestOptions, setGuestOptions] = useState<User[]>([]);
  const [guestSearchQuery, setGuestSearchQuery] = useState("");
  const [guestOpen, setGuestOpen] = useState(false);
  const debouncedGuestQuery = useDebounce(guestSearchQuery, 300);

  useEffect(() => {
    getRoomById(roomId).then(({ room: fetchedRoom }) => setRoom(fetchedRoom));
  }, [roomId]);

  useEffect(() => {
    if (!debouncedQuery) {
      setUserOptions([]);
      return;
    }
    searchUsers(debouncedQuery).then(({ users }) => setUserOptions(users || []));
  }, [debouncedQuery]);

  useEffect(() => {
    if (!debouncedGuestQuery) {
      setGuestOptions([]);
      return;
    }
    searchUsers(debouncedGuestQuery).then(({ users }) => setGuestOptions(users || []));
  }, [debouncedGuestQuery]);

  const form = useForm<MeetingDetailsFormValues>({
    defaultValues: meetingDetailsFormDefaultValues,
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "guests",
  });

  const hostEmail = form.watch("email");

  const filteredGuestOptions = guestOptions.filter(
    (u) => u.email !== hostEmail && !fields.some((f) => f.value === u.email)
  );

  const onSubmit = async (data: MeetingDetailsFormValues) => {
    if (!room || !selectedTime || !selectedDuration) return;

    setIsSubmitting(true);
    try {
      const startDate = parse(selectedTime, "HH:mm", selectedDate);
      const endDate = addMinutes(startDate, Number(selectedDuration));

      const event = {
        title: data.subject,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        date: startDate,
        booked_by: "",
        email: data.email,
        duration: `${selectedDuration} Minutes`,
        guests: JSON.stringify(
          data.guests?.map((g) => ({ email: g.value, name: nameFromEmail(g.value) })) ??
            []
        ),
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
          hostName: data.email,
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
    <form
      id="meeting-details-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="mt-6"
    >
      <FieldGroup className="grid grid-cols-2 gap-4">
        <Controller
          name="subject"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor={field.name}
                className={cn(
                  "text-lg",
                  isAvailable ? "text-[#0A76B9]" : "text-secondary"
                )}
              >
                Meeting Subject
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                placeholder="Enter what the meeting is about"
                className={
                  isAvailable
                    ? "border-[#6CADD5]/40 bg-white! text-[#06476F] placeholder:text-[#0A76B9] hover:bg-white! focus-visible:border-[#6CADD5] focus-visible:bg-white! focus-visible:ring-[#6CADD5]/20"
                    : "border-secondary bg-transparent text-secondary/90 placeholder:text-secondary/90 hover:bg-transparent focus-visible:border-secondary/50 focus-visible:bg-transparent focus-visible:ring-secondary/20"
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor={field.name}
                className={cn(
                  "text-lg",
                  isAvailable ? "text-[#0A76B9]" : "text-secondary"
                )}
              >
                Your Email
              </FieldLabel>
              <Popover
                open={open}
                onOpenChange={(isOpen) => {
                  setOpen(isOpen);
                  if (!isOpen) setSearchQuery("");
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-invalid={fieldState.invalid}
                    className={cn(
                      "w-full justify-between rounded-lg py-4.5! font-normal",
                      isAvailable
                        ? "border! border-[#6CADD5]/40! bg-white! text-[#06476F] hover:bg-[#F3F8FC]! hover:text-[#06476F]!"
                        : "border! border-secondary/10! bg-secondary/10! text-secondary/90 hover:bg-secondary/20! hover:text-secondary!",
                      fieldState.invalid &&
                        "border-destructive! ring-2 ring-destructive/20"
                    )}
                  >
                    <span>{field.value || "Search by email..."}</span>
                    {field.value && (
                      <span
                        role="button"
                        aria-label="Clear email"
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange("");
                        }}
                        className="ml-2 rounded-sm opacity-70 hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Type to search..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {searchQuery ? "No users found" : "Type to search..."}
                      </CommandEmpty>
                      <CommandGroup>
                        {userOptions.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.email}
                            onSelect={() => {
                              field.onChange(user.email);
                              setOpen(false);
                              setSearchQuery("");
                            }}
                          >
                            {user.email}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* guests */}

        <Controller
          name="guests"
          control={form.control}
          render={() => (
            <Field className="col-span-2">
              <FieldLabel
                className={cn(
                  "text-lg",
                  isAvailable ? "text-[#0A76B9]" : "text-secondary"
                )}
              >
                Guests
              </FieldLabel>
              <Popover
                open={guestOpen}
                onOpenChange={(isOpen) => {
                  setGuestOpen(isOpen);
                  if (!isOpen) setGuestSearchQuery("");
                }}
              >
                <PopoverTrigger asChild>
                  <div
                    role="combobox"
                    aria-expanded={guestOpen}
                    aria-controls="guest-popover"
                    tabIndex={0}
                    className={cn(
                      "flex min-h-[2.75rem] w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none",
                      isAvailable
                        ? "border-[#6CADD5]/40 bg-white text-[#06476F] hover:bg-[#F3F8FC] focus-visible:ring-[#6CADD5]/20"
                        : "border-secondary/10 bg-secondary/10 text-secondary/90 hover:bg-secondary/20 focus-visible:ring-secondary/20"
                    )}
                  >
                    {fields.length > 0 ? (
                      fields.map((field, index) => (
                        <Badge key={field.id} variant="secondary" className="gap-1 pr-1">
                          {field.value}
                          <button
                            type="button"
                            aria-label={`Remove ${field.value}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(index);
                            }}
                            className="ml-0.5 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span>Add guests...</span>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent id="guest-popover" className="w-full p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Type to search..."
                      value={guestSearchQuery}
                      onValueChange={setGuestSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {guestSearchQuery ? "No users found" : "Type to search..."}
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredGuestOptions.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.email}
                            onSelect={() => {
                              append({ value: user.email });
                            }}
                          >
                            {user.email}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
