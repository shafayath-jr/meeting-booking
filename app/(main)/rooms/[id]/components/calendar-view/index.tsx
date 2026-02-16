"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { Meeting } from "@/types/meeting";
import {
  getMeetingsByRoomForDateRange,
  getMeetingsByRoom,
} from "@/actions/meeting";
import MonthCalendar from "./month-calendar";
import DayScheduleView from "./day-schedule-view";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingSlot } from "./types";
import MeetingDetailsModal from "../meeting-details-modal";
import MeetingsList from "../meetings-list";
import { useMeetingsContext } from "@/components/providers/meetings-provider";

interface CalendarViewProps {
  onSlotSelect: (slot: BookingSlot) => void;
  className?: string;
}

export default function CalendarView({
  onSlotSelect,
  className,
}: CalendarViewProps) {
  const { id: roomId } = useParams<{ id: string }>();
  const { refreshKey } = useMeetingsContext();

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [monthMeetings, setMonthMeetings] = useState<Meeting[]>([]);
  const [dayMeetings, setDayMeetings] = useState<Meeting[]>([]);
  const [isLoadingMonth, setIsLoadingMonth] = useState(true);
  const [isLoadingDay, setIsLoadingDay] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  // Fetch meetings for the current month
  const fetchMonthMeetings = useCallback(async () => {
    setIsLoadingMonth(true);
    try {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);

      const { meetings } = await getMeetingsByRoomForDateRange(
        roomId,
        monthStart.toISOString(),
        monthEnd.toISOString()
      );
      setMonthMeetings(meetings || []);
    } catch (error) {
      console.error("Failed to fetch month meetings:", error);
      setMonthMeetings([]);
    } finally {
      setIsLoadingMonth(false);
    }
  }, [roomId, currentMonth]);

  // Fetch meetings for the selected day
  const fetchDayMeetings = useCallback(async () => {
    if (!selectedDate) {
      setDayMeetings([]);
      return;
    }

    setIsLoadingDay(true);
    try {
      const { meetings } = await getMeetingsByRoom(
        roomId,
        selectedDate.toISOString()
      );
      setDayMeetings(meetings || []);
    } catch (error) {
      console.error("Failed to fetch day meetings:", error);
      setDayMeetings([]);
    } finally {
      setIsLoadingDay(false);
    }
  }, [roomId, selectedDate]);

  // Fetch month meetings when month changes or refreshKey updates (real-time)
  useEffect(() => {
    fetchMonthMeetings();
  }, [fetchMonthMeetings, refreshKey]);

  // Fetch day meetings when selected date changes or refreshKey updates (real-time)
  useEffect(() => {
    fetchDayMeetings();
  }, [fetchDayMeetings, refreshKey]);

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSlotClick = (time: string) => {
    if (selectedDate) {
      onSlotSelect({
        date: selectedDate,
        startTime: time,
      });
    }
  };

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsMeetingModalOpen(true);
  };

  const handleMeetingModalClose = () => {
    setIsMeetingModalOpen(false);
    setSelectedMeeting(null);
  };

  const handleMeetingDelete = useCallback(() => {
    // Refresh meetings after deletion
    fetchMonthMeetings();
    fetchDayMeetings();
    // Trigger a refresh by updating a state that meetings list can watch
    setSelectedDate((prev) => (prev ? new Date(prev) : null));
  }, [fetchMonthMeetings, fetchDayMeetings]);

  return (
    <>
      <div className={cn("flex flex-col lg:flex-row gap-4 h-full", className)}>
        {/* Meetings List - Left Side */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col h-full glass glass-shadow rounded-2xl p-5">
          <MeetingsList onMeetingClick={handleMeetingClick} />
        </div>

        {/* Calendar - Middle */}
        <div className="flex-1 min-w-[300px] flex flex-col h-full glass glass-shadow rounded-2xl p-5">
          <div className="w-full flex-shrink-0">
            {isLoadingMonth ? (
              <MonthCalendarSkeleton />
            ) : (
              <MonthCalendar
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                meetings={monthMeetings}
                onMonthChange={handleMonthChange}
                onDaySelect={handleDaySelect}
              />
            )}
          </div>
        </div>

        {/* Day Schedule - Right Side */}
        <div className="flex-1 min-w-[300px] flex flex-col h-full glass glass-shadow rounded-2xl p-5">
          <DayScheduleView
            selectedDate={selectedDate}
            meetings={dayMeetings}
            isLoading={isLoadingDay}
            onSlotClick={handleSlotClick}
            onMeetingClick={handleMeetingClick}
          />
        </div>
      </div>

      {/* Meeting Details Modal */}
      <MeetingDetailsModal
        isOpen={isMeetingModalOpen}
        onClose={handleMeetingModalClose}
        meeting={selectedMeeting}
        onDelete={handleMeetingDelete}
      />
    </>
  );
}

function MonthCalendarSkeleton() {
  return (
    <div className="p-3 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-8 h-8" />
      </div>

      {/* Weekdays */}
      <div className="flex gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="flex-1 h-6" />
        ))}
      </div>

      {/* Days grid */}
      {Array.from({ length: 5 }).map((_, weekIndex) => (
        <div key={weekIndex} className="flex gap-1">
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <Skeleton key={dayIndex} className="flex-1 aspect-square" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Export refresh function for external use
export { CalendarView };
