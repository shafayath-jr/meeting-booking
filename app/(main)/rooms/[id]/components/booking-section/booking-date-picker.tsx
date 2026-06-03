"use client";

import { format, startOfToday, addDays, isToday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useBookingContext } from "./booking-context";

export default function BookingDatePicker() {
  const { selectedDate, setSelectedDate } = useBookingContext();

  const today = startOfToday();
  const maxDate = addDays(today, 6);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="transparent"
          className={cn(
            "h-12 w-full justify-start gap-3 rounded-xl border border-secondary/20 bg-secondary/10 px-4 text-left font-normal text-secondary",
            "hover:bg-secondary/20"
          )}
        >
          <CalendarIcon className="h-4 w-4 text-secondary/70" />
          <span className="flex-1">
            {isToday(selectedDate)
              ? `Today, ${format(selectedDate, "MMM d, yyyy")}`
              : format(selectedDate, "EEE, MMM d, yyyy")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto border-secondary/30 bg-[#0C170F]/95 p-2 text-secondary"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          disabled={{ before: today, after: maxDate }}
          autoFocus
          className="bg-transparent text-secondary [--cell-size:--spacing(9)]"
          classNames={{
            caption_label: "select-none font-medium text-sm text-secondary",
            button_previous:
              "size-(--cell-size) p-0 select-none text-white/70 hover:bg-white/10 hover:text-secondary aria-disabled:opacity-50",
            button_next:
              "size-(--cell-size) p-0 select-none text-white/70 hover:bg-white/10 hover:text-secondary aria-disabled:opacity-50",
            weekday:
              "rounded-md flex-1 font-normal text-[0.8rem] select-none text-white/40",
            day_button:
              "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal text-secondary rounded-md hover:bg-white/10 data-[selected-single=true]:bg-secondary data-[selected-single=true]:text-[#0F401D] data-[selected-single=true]:hover:bg-secondary/90",
            today:
              "rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 data-[selected=true]:rounded-md",
            outside: "text-white/20 aria-selected:text-white/30",
            disabled: "text-white/15 opacity-40",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
