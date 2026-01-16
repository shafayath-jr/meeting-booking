"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker";
import { format, isSameDay, startOfToday } from "date-fns";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Meeting } from "@/types/meeting";
import BookingIndicator from "./booking-indicator";

interface MonthCalendarProps {
  currentMonth: Date;
  selectedDate: Date | null;
  meetings: Meeting[];
  onMonthChange: (month: Date) => void;
  onDaySelect: (date: Date) => void;
  className?: string;
}

export default function MonthCalendar({
  currentMonth,
  selectedDate,
  meetings,
  onMonthChange,
  onDaySelect,
  className,
}: MonthCalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  // Count meetings per day
  const meetingsByDay = React.useMemo(() => {
    const counts = new Map<string, number>();
    meetings.forEach((meeting) => {
      const dateKey = format(new Date(meeting.start_time), "yyyy-MM-dd");
      counts.set(dateKey, (counts.get(dateKey) || 0) + 1);
    });
    return counts;
  }, [meetings]);

  const getMeetingCount = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return meetingsByDay.get(dateKey) || 0;
  };

  return (
    <DayPicker
      mode="single"
      month={currentMonth}
      onMonthChange={onMonthChange}
      selected={selectedDate || undefined}
      onSelect={(date) => date && onDaySelect(date)}
      showOutsideDays={true}
      className={cn(
        "group/calendar [--cell-size:--spacing(10)]",
        className
      )}
      classNames={{
        root: cn("w-full", defaultClassNames.root),
        months: cn("flex flex-col", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "size-(--cell-size) p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "size-(--cell-size) p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          "select-none font-medium text-sm",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 font-normal text-[0.8rem] select-none text-center",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        day: cn(
          "relative w-full h-full p-0 text-center group/day aspect-square select-none",
          defaultClassNames.day
        ),
        today: cn(
          "bg-accent text-accent-foreground rounded-md",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn("relative", className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            );
          }
          return (
            <ChevronRightIcon className={cn("size-4", className)} {...props} />
          );
        },
        DayButton: ({ day, modifiers, className, ...props }) => {
          const meetingCount = getMeetingCount(day.date);
          const isSelected = selectedDate && isSameDay(day.date, selectedDate);
          const isToday = isSameDay(day.date, startOfToday());

          return (
            <Button
              variant="ghost"
              size="icon"
              data-day={day.date.toLocaleDateString()}
              data-selected={isSelected}
              className={cn(
                "relative flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-0.5 leading-none font-normal",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                isToday && !isSelected && "bg-accent text-accent-foreground",
                modifiers.outside && "text-muted-foreground opacity-50",
                className
              )}
              {...props}
            >
              <span>{day.date.getDate()}</span>
              <BookingIndicator
                count={meetingCount}
                className={cn(isSelected && "[&_span]:bg-primary-foreground")}
              />
            </Button>
          );
        },
      }}
    />
  );
}
