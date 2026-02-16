import { DefaultValues } from "react-hook-form";
import z from "zod";

export const formSchema = z.object({
  name: z.string().optional(),
  duration: z.string().min(1, "You must select a meeting duration"),
});

export type QuickMeetingFormValues = z.infer<typeof formSchema>;

export const quickMeetingFormDefaultValues: DefaultValues<QuickMeetingFormValues> = {
  name: "",
  duration: "",
};
