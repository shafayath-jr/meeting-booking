import { DefaultValues } from "react-hook-form";
import z from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  emailUsername: z.string().min(1, "Email username is required"),
  emailDomain: z.string().min(1, "Email domain is required"),
  date: z.date({
    error: "Meeting date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  duration: z.string().min(1, "Duration is required"),
  guests: z.array(z.object({ value: z.string() })).optional(),
});

export type BookMeetingFormValues = z.infer<typeof formSchema>;

export const bookMeetingFormDefaultValues: DefaultValues<BookMeetingFormValues> =
  {
    name: "",
    date: undefined,
    startTime: "",
    duration: "",
    emailUsername: "",
    emailDomain: "",
    guests: [],
  };
