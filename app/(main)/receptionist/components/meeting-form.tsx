"use client";

import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMinutes, set } from "date-fns";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import {
  formSchema,
  meetingDetailsFormDefaultValues,
  MeetingDetailsFormValues,
} from "@/app/(main)/rooms/[id]/components/booking-section/meeting-details-form/form-schema";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, nameFromEmail } from "@/lib/utils";
import { searchUsers } from "@/actions/user";
import { bookMeeting } from "@/actions/meeting";
import { User } from "@/types/user";

import { useReceptionistBooking } from "./receptionist-booking-context";

function slotStartOnDate(slot: string, date: Date): Date {
  const [hours, minutes] = slot.split(":").map(Number);
  return set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
}

export default function MeetingForm() {
  const {
    selectedBuildingId,
    selectedRoomId,
    selectedDate,
    selectedTime,
    selectedDuration,
    isSubmitting,
    setIsSubmitting,
    setSelectedTime,
    setSelectedDuration,
    triggerRefresh,
  } = useReceptionistBooking();

  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const [guestOptions, setGuestOptions] = useState<User[]>([]);
  const [guestSearchQuery, setGuestSearchQuery] = useState("");
  const [guestOpen, setGuestOpen] = useState(false);
  const debouncedGuestQuery = useDebounce(guestSearchQuery, 300);

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

  const canSubmit =
    !!selectedBuildingId && !!selectedRoomId && !!selectedTime && !!selectedDuration;

  const onSubmit = async (data: MeetingDetailsFormValues) => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const startDate = slotStartOnDate(selectedTime!, selectedDate);
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
        room_id: selectedRoomId!,
        building_id: selectedBuildingId!,
      };

      const res = await bookMeeting(event);

      if (res.error) {
        toast.error(res.error || "Something went wrong!");
        return;
      }

      toast.success("Meeting booked successfully");
      form.reset();
      setSelectedTime(null);
      setSelectedDuration(null);
      triggerRefresh();
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      id="receptionist-meeting-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <FieldGroup className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Controller
          name="subject"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-sm text-foreground/80">
                Meeting Subject
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                placeholder="What is the meeting about?"
                className="h-11 rounded-md! border-black/15! bg-[#d4e2db]! text-foreground shadow-none! backdrop-blur-none! placeholder:text-foreground/45 hover:bg-[#d4e2db]! focus-visible:border-emerald-500/40! focus-visible:bg-[#d4e2db]! focus-visible:ring-emerald-500/20!"
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
              <FieldLabel htmlFor={field.name} className="text-sm text-foreground/80">
                Host email
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
                    className="w-full justify-between border! border-black/15! bg-[#d4e2db]! py-5! font-normal text-foreground shadow-none hover:bg-[#d4e2db]! hover:text-foreground!"
                  >
                    <span
                      className={cn("truncate", !field.value && "text-foreground/45")}
                    >
                      {field.value || "Search by email..."}
                    </span>
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
                <PopoverContent
                  className="w-(--radix-popover-trigger-width) border-0 bg-[#d4e2db] p-0"
                  align="start"
                >
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

        <Controller
          name="guests"
          control={form.control}
          render={() => (
            <Field className="xl:col-span-2">
              <FieldLabel className="text-sm text-foreground/80">Guests</FieldLabel>
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
                    aria-controls="receptionist-guest-popover"
                    tabIndex={0}
                    className="flex min-h-[2.75rem] w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-md border border-black/15 bg-[#d4e2db] px-3 py-2 text-sm text-foreground hover:bg-[#d4e2db] focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:outline-none"
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
                      <span className="text-foreground/45">Add guests...</span>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  id="receptionist-guest-popover"
                  className="w-(--radix-popover-trigger-width) border-0 bg-[#d4e2db] p-0"
                  align="start"
                >
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

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="outline"
          disabled={!canSubmit || isSubmitting}
          className="rounded-xl border-emerald-500 bg-emerald-500! px-8 py-5 text-white hover:bg-emerald-600!"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Booking...
            </span>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </form>
  );
}
