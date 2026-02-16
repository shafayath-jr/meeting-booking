"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  format,
  isAfter,
  startOfDay,
  addDays,
  subDays,
  parseISO,
} from "date-fns";

type Props = {
  selectedDate: string; // Format: "yyyy-MM-dd"
};

export default function DateCycle({ selectedDate }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentDate = parseISO(selectedDate);

  const updateURL = (date: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", format(date, "yyyy-MM-dd"));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePreviousDate = () => {
    const newDate = subDays(currentDate, 1);
    const today = startOfDay(new Date());

    if (newDate >= today) {
      updateURL(newDate);
    }
  };

  const handleNextDate = () => {
    const newDate = addDays(currentDate, 1);
    updateURL(newDate);
  };

  const isPreviousDisabled = () => {
    return !isAfter(currentDate, startOfDay(new Date()));
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="space-y-6">
        {/* date display */}

        <p className="text-center text-lg md:text-xl lg:text-3xl font-semibold">
          {currentDate.toLocaleDateString("en-GB", {
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
