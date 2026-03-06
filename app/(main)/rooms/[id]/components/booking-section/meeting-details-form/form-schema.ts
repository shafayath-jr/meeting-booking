import { DefaultValues } from "react-hook-form";
import z from "zod";

export const formSchema = z.object({
  subject: z.string().min(1, "Meeting subject is required"),
  hostName: z.string().min(1, "Host name is required"),
  emailUsername: z.string().min(1, "Required"),
  emailDomain: z.string().min(1, "Required"),
});

export type MeetingDetailsFormValues = z.infer<typeof formSchema>;

export const meetingDetailsFormDefaultValues: DefaultValues<MeetingDetailsFormValues> = {
  subject: "",
  hostName: "",
  emailUsername: "",
  emailDomain: "",
};
