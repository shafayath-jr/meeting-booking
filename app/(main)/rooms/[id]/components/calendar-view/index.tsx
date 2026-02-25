"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { Meeting } from "@/types/meeting";
import { getMeetingsByRoomForDateRange, getMeetingsByRoom } from "@/actions/meeting";
import MonthCalendar from "./month-calendar";
import DayScheduleView from "./day-schedule-view";
import { BookingSlot } from "./types";
import { MonthCalendarSkeleton } from "@/app/(main)/components/skeletons/month-calendar-skeleton";
import MeetingDetailsModal from "../meeting-details-modal";
import MeetingsList from "../meetings-list";
import { useMeetingsContext } from "@/components/providers/meetings-provider";

interface CalendarViewProps {
  onSlotSelect: (slot: BookingSlot) => void;
  className?: string;
}

export default function CalendarView({ onSlotSelect, className }: CalendarViewProps) {
  const { id: roomId } = useParams<{ id: string }>();
  const { refreshKey, triggerRefresh } = useMeetingsContext();

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
      const { meetings } = await getMeetingsByRoom(roomId, selectedDate.toISOString());
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
    triggerRefresh();
  }, [triggerRefresh]);

  return (
    <>
      {/* Meeting Details Modal */}
      <MeetingDetailsModal
        isOpen={isMeetingModalOpen}
        onClose={handleMeetingModalClose}
        meeting={selectedMeeting}
        onDelete={handleMeetingDelete}
      />

      <div className={cn("flex h-full flex-col gap-4 lg:flex-row", className)}>
        {/* Meetings List - Left Side */}

        <div className="glass flex h-full w-full shrink-0 flex-col rounded-2xl p-5 lg:w-80 xl:w-96">
          <MeetingsList onMeetingClick={handleMeetingClick} />
        </div>

        {/* Calendar - Middle */}
        <div className="glass flex h-full min-w-[300px] flex-1 flex-col rounded-2xl p-5">
          <div className="w-full shrink-0">
            {isLoadingMonth ? (
              <MonthCalendarSkeleton />
            ) : (
              <MonthCalendar
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                meetings={monthMeetings}
                onMonthChange={setCurrentMonth}
                onDaySelect={setSelectedDate}
              />
            )}
          </div>
        </div>

        {/* Day Schedule - Right Side */}
        <div className="glass flex h-full min-w-[300px] flex-1 flex-col rounded-2xl p-5">
          <DayScheduleView
            selectedDate={selectedDate}
            meetings={dayMeetings}
            isLoading={isLoadingDay}
            onSlotClick={handleSlotClick}
            onMeetingClick={handleMeetingClick}
          />
        </div>
      </div>
    </>
  );
}
