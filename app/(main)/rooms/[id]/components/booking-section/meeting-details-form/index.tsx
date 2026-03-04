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

export default function MeetingDetailsForm() {
  const form = useForm<MeetingDetailsFormValues>({
    defaultValues: meetingDetailsFormDefaultValues,
    resolver: zodResolver(formSchema),
  });

  return (
    <form id="meeting-details-form">
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
                className="border-secondary bg-transparent text-secondary placeholder:text-secondary hover:bg-transparent focus-visible:border-secondary/50 focus-visible:bg-transparent focus-visible:ring-secondary/20"
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
                className="border-secondary bg-transparent text-secondary placeholder:text-secondary hover:bg-transparent focus-visible:border-secondary/50 focus-visible:bg-transparent focus-visible:ring-secondary/20"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
