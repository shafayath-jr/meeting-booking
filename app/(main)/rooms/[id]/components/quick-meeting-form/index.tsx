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

export default function QuickMeetingForm() {
  const form = useForm<QuickMeetingFormValues>({
    defaultValues: quickMeetingFormDefaultValues,
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: QuickMeetingFormValues) => {
    console.log(data);
    form.reset();
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
