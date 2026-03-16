import { DefaultValues } from "react-hook-form";
import z from "zod";

export const formSchema = z.object({
  subject: z.string().min(1, "Meeting subject is required"),

  email: z.email("Valid email required"),

  guests: z.array(z.object({ value: z.string() })).optional(),
});

export type MeetingDetailsFormValues = z.infer<typeof formSchema>;

export const meetingDetailsFormDefaultValues: DefaultValues<MeetingDetailsFormValues> = {
  subject: "",

  email: "",

  guests: [],
};
