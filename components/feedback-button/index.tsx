"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, SmilePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
  feedbackFormSchema,
  feedbackFormDefaultValues,
  type FeedbackFormValues,
} from "./form-schema";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FeedbackFormValues>({
    defaultValues: feedbackFormDefaultValues,
    resolver: zodResolver(feedbackFormSchema),
  });

  function onSubmit(data: FeedbackFormValues) {
    console.log(data);
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      form.reset();
      setSubmitted(false);
    }, 1500);
  }

  function handleClose() {
    setOpen(false);
    setSubmitted(false);
    form.reset();
  }

  return (
    <>
      {/* Popup panel */}
      <div
        className={cn(
          "fixed bottom-24 left-6 z-50 w-80 rounded-2xl border border-gray-100 bg-white shadow-2xl transition-all duration-300",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <span className="text-sm font-semibold text-gray-800">
            How was your experience?
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6 text-gray-400 hover:text-gray-600"
            aria-label="Close feedback"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-4">
          {submitted ? (
            <p className="py-4 text-center text-sm text-gray-600">
              Thank you for your feedback!
            </p>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Controller
                control={form.control}
                name="comment"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel className="sr-only" htmlFor="feedback-comment">
                      Comment
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="feedback-comment"
                      placeholder="What could be improved?"
                      className="min-h-[96px] resize-none border! border-gray-300! text-sm"
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Button type="submit" className="mt-3 ml-auto block">
                <Send className="h-6 w-6" />
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Floating trigger button */}
      <Button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-lg"
        aria-label="Open feedback"
      >
        <SmilePlus className="h-6 w-6" />
      </Button>
    </>
  );
}
