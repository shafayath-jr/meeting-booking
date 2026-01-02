"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { format, isAfter, startOfDay, addDays, subDays } from "date-fns";

export default function DateCycle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getTodayDate = () => startOfDay(new Date());

  const [selectedDate, setSelectedDate] = useState<Date>(getTodayDate);

  const updateURL = (date: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", format(date, "yyyy-MM-dd"));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePreviousDate = () => {
    const newDate = subDays(selectedDate, 1);
    const today = getTodayDate();

    if (newDate >= today) {
      setSelectedDate(newDate);
      updateURL(newDate);
    }
  };

  const handleNextDate = () => {
    const newDate = addDays(selectedDate, 1);
    setSelectedDate(newDate);
    updateURL(newDate);
  };

  const isPreviousDisabled = () => {
    return !isAfter(selectedDate, startOfDay(new Date()));
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="space-y-6">
        {/* date display */}

        <p className="text-center text-lg md:text-xl lg:text-3xl font-semibold">
          {selectedDate.toLocaleDateString("en-GB", {
            weekday: "short",
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </p>

        {/* navigation */}

        {/* Navigation Buttons */}

        <div className="flex items-center justify-center gap-4">
          <Button
            size="icon-lg"
            onClick={handlePreviousDate}
            disabled={isPreviousDisabled()}
          >
            <ChevronsLeft className="size-6" />
          </Button>

          <Button size="icon-lg" onClick={handleNextDate}>
            <ChevronsRight className="size-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
