"use client";

import { format, startOfToday, addDays, isToday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useBookingContext } from "./booking-context";
import { useGradientContext } from "@/components/providers/gradient-context";

export default function BookingDatePicker() {
  const { selectedDate, setSelectedDate } = useBookingContext();
  const { variant } = useGradientContext();
  const isAvailable = variant === "available" || variant === "default";
  const isOngoing = variant === "ongoing" || variant === "unavailable";
  const isUpcoming = variant === "upcoming-soon";

  const today = startOfToday();
  const maxDate = addDays(today, 6);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="transparent"
          className={cn(
            "h-12 w-full justify-start gap-3 rounded-xl border px-4 text-left font-normal",
            isAvailable
              ? "border-[#6CADD5]/60 bg-[#F3F8FC] text-[#0A76B9] hover:bg-[#F3F8FC]"
              : isOngoing
                ? "border-[#C07090]/60 bg-white text-[#7F012E] hover:bg-white"
                : isUpcoming
                  ? "border-[#EFB700]/60 bg-[#FFF8E5] text-[#8A5A00] hover:bg-[#FFF8E5]"
                  : "border-secondary/20 bg-secondary/10 text-secondary hover:bg-secondary/20"
          )}
        >
          <CalendarIcon
            className={cn(
              "h-4 w-4",
              isAvailable
                ? "text-[#0A76B9]/70"
                : isOngoing
                  ? "text-[#7F012E]/70"
                  : isUpcoming
                    ? "text-[#8A5A00]/70"
                    : "text-secondary/70"
            )}
          />
          <span className="flex-1">
            {isToday(selectedDate)
              ? `Today, ${format(selectedDate, "MMM d, yyyy")}`
              : format(selectedDate, "EEE, MMM d, yyyy")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          "w-auto p-2",
          isAvailable
            ? "border border-[#6CADD5]/40 bg-[#F3F8FC]!"
            : isOngoing
              ? "border border-[#C07090]/40 bg-white!"
              : isUpcoming
                ? "border border-[#EFB700]/40 bg-[#FFF8E5]!"
                : "border border-emerald-500/20 bg-emerald-950!"
        )}
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          disabled={{ before: today, after: maxDate }}
          autoFocus
          className={cn(
            "bg-transparent [--cell-size:--spacing(9)]",
            isAvailable
              ? "text-[#0A76B9] [--ring:#6CADD5]"
              : isOngoing
                ? "text-[#7F012E] [--ring:#C07090]"
                : isUpcoming
                  ? "text-[#8A5A00] [--ring:#EFB700]"
                  : "text-secondary [--ring:#10b981]"
          )}
          classNames={
            isAvailable
              ? {
                  caption_label: "select-none font-medium text-sm text-[#0A76B9]",
                  button_previous:
                    "size-(--cell-size) p-0 select-none text-[#0A76B9]/70 hover:bg-[#6CADD5]/20 hover:text-[#0A76B9] aria-disabled:opacity-50",
                  button_next:
                    "size-(--cell-size) p-0 select-none text-[#0A76B9]/70 hover:bg-[#6CADD5]/20 hover:text-[#0A76B9] aria-disabled:opacity-50",
                  weekday:
                    "rounded-md flex-1 font-semibold text-[0.8rem] select-none text-[#0A76B9]/60",
                  day_button:
                    "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal text-[#0A76B9] rounded-md bg-white border border-[#6CADD5]/30 hover:bg-[#6CADD5]/20 hover:border-[#6CADD5] data-[selected-single=true]:bg-[#0A76B9] data-[selected-single=true]:text-white data-[selected-single=true]:border-[#0A76B9]",
                  today:
                    "rounded-md border border-[#6CADD5] bg-[#6CADD5]/10 text-[#0A76B9]",
                  outside: "text-[#0A76B9]/20 aria-selected:text-[#0A76B9]/30",
                  disabled: "text-[#0A76B9]/30",
                }
              : isOngoing
                ? {
                    caption_label: "select-none font-medium text-sm text-[#7F012E]",
                    button_previous:
                      "size-(--cell-size) p-0 select-none text-[#7F012E]/70 hover:bg-[#C07090]/20 hover:text-[#7F012E] aria-disabled:opacity-50",
                    button_next:
                      "size-(--cell-size) p-0 select-none text-[#7F012E]/70 hover:bg-[#C07090]/20 hover:text-[#7F012E] aria-disabled:opacity-50",
                    weekday:
                      "rounded-md flex-1 font-semibold text-[0.8rem] select-none text-[#7F012E]/60",
                    day_button:
                      "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal text-[#7F012E] rounded-md bg-white border border-[#C07090]/30 hover:bg-[#C07090]/20 hover:border-[#C07090] data-[selected-single=true]:bg-[#7F012E] data-[selected-single=true]:text-white data-[selected-single=true]:border-[#7F012E]",
                    today:
                      "rounded-md border border-[#C07090] bg-[#C07090]/10 text-[#7F012E]",
                    outside: "text-[#7F012E]/20 aria-selected:text-[#7F012E]/30",
                    disabled: "text-[#7F012E]/30",
                  }
                : isUpcoming
                  ? {
                      caption_label: "select-none font-medium text-sm text-[#8A5A00]",
                      button_previous:
                        "size-(--cell-size) p-0 select-none text-[#8A5A00]/70 hover:bg-[#EFB700]/20 hover:text-[#8A5A00] aria-disabled:opacity-50",
                      button_next:
                        "size-(--cell-size) p-0 select-none text-[#8A5A00]/70 hover:bg-[#EFB700]/20 hover:text-[#8A5A00] aria-disabled:opacity-50",
                      weekday:
                        "rounded-md flex-1 font-semibold text-[0.8rem] select-none text-[#8A5A00]/60",
                      day_button:
                        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal text-[#8A5A00] rounded-md bg-white border border-[#EFB700]/30 hover:bg-[#EFB700]/20 hover:border-[#EFB700] data-[selected-single=true]:bg-[#8A5A00] data-[selected-single=true]:text-white data-[selected-single=true]:border-[#8A5A00]",
                      today:
                        "rounded-md border border-[#EFB700] bg-[#EFB700]/10 text-[#8A5A00]",
                      outside: "text-[#8A5A00]/20 aria-selected:text-[#8A5A00]/30",
                      disabled: "text-[#8A5A00]/30",
                    }
                  : {
                      caption_label: "select-none font-medium text-sm text-secondary",
                      button_previous:
                        "size-(--cell-size) p-0 select-none text-white/70 hover:bg-white/10 hover:text-secondary aria-disabled:opacity-50",
                      button_next:
                        "size-(--cell-size) p-0 select-none text-white/70 hover:bg-white/10 hover:text-secondary aria-disabled:opacity-50",
                      weekday:
                        "rounded-md flex-1 font-semibold text-[0.8rem] select-none text-white/80",
                      day_button:
                        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal text-secondary rounded-md hover:bg-emerald-500/20 hover:text-white data-[selected-single=true]:bg-emerald-500 data-[selected-single=true]:text-white data-[selected-single=true]:hover:bg-emerald-400",
                      today:
                        "rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
                      outside: "text-white/20 aria-selected:text-white/30",
                      disabled: "text-white",
                    }
          }
        />
      </PopoverContent>
    </Popover>
  );
}
