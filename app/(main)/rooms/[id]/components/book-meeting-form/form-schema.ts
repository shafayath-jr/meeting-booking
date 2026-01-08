import { DefaultValues } from "react-hook-form";
import z from "zod";

export const formSchema = z.object({
  title: z.string().min(1, "Meeting title is required"),
  date: z.date({
    required_error: "Meeting date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  duration: z.string().min(1, "Duration is required"),
  bookedBy: z.string().min(1, "Your name is required"),
  email: z.string().email("Valid email is required"),
  guests: z.string().optional(),
});

export type BookMeetingFormValues = z.infer<typeof formSchema>;

export const bookMeetingFormDefaultValues: DefaultValues<BookMeetingFormValues> =
  {
    title: "",
    date: undefined,
    startTime: "",
    duration: "15",
    bookedBy: "",
    email: "",
    guests: "",
  };
