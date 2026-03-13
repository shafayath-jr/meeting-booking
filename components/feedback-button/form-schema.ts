import { DefaultValues } from "react-hook-form";
import z from "zod";

export const feedbackFormSchema = z.object({
  comment: z.string().min(1, "Please enter a feedback before submitting"),
});

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export const feedbackFormDefaultValues: DefaultValues<FeedbackFormValues> = {
  comment: "",
};
