"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Meeting } from "@/types/meeting";
import { getMeetingsByRoom } from "@/actions/meeting";
import { useMeetingsContext } from "@/components/providers/meetings-provider";
import { TIME_SLOTS } from "@/lib/constants";
import { parse, addMinutes, isToday, isBefore, startOfToday } from "date-fns";
import { calculateAvailableDurations } from "@/lib/duration-helper";

export type SuccessData = {
  subject: string;
  hostName: string;
  startTime: Date;
  endTime: Date;
};

type BookingContextType = {
  isModalOpen: boolean;
  isSubmitting: boolean;
  selectedDate: Date;
  selectedTime: string | null;
  selectedDuration: string | null;
  meetings: Meeting[];
  todayMeetings: Meeting[];
  showSuccess: boolean;
  successData: SuccessData | null;
  hasAvailableSlots: boolean;
  todayHasAvailableSlots: boolean;
  openModal: () => void;
  closeModal: () => void;
  setSelectedDate: (date: Date) => void;
  setSelectedTime: (time: string) => void;
  setSelectedDuration: (dur: string) => void;
  resetFlow: () => void;
  setBookingSuccess: (data: SuccessData) => void;
  setIsSubmitting: (val: boolean) => void;
};

const BookingContext = createContext<BookingContextType | null>(null);

type BookingProviderProps = {
  children: ReactNode;
  initialMeetings: Meeting[];
  roomId: string;
};

function calcHasAvailableSlots(meetings: Meeting[]): boolean {
  const now = new Date();
  return TIME_SLOTS.some((slot) => {
    const slotStart = parse(slot, "HH:mm", now);
    const slotEnd = addMinutes(slotStart, 30);
    if (isToday(now) && isBefore(slotStart, now)) return false;
    return !meetings.some((m) => {
      const mStart = new Date(m.start_time);
      const mEnd = new Date(m.end_time);
      return slotStart < mEnd && slotEnd > mStart;
    });
  });
}

export function BookingProvider({
  children,
  initialMeetings,
  roomId,
}: BookingProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDateState] = useState<Date>(() => startOfToday());
  const [selectedTime, setSelectedTimeState] = useState<string | null>(null);
  const [selectedDuration, setSelectedDurationState] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [todayMeetings, setTodayMeetings] = useState<Meeting[]>(initialMeetings);

  const { refreshKey } = useMeetingsContext();

  useEffect(() => {
    if (isModalOpen) return;
    getMeetingsByRoom(roomId, selectedDate.toISOString()).then(
      ({ meetings: fetched }) => {
        if (fetched) setMeetings(fetched);
      }
    );
  }, [refreshKey, selectedDate]);

  useEffect(() => {
    if (isModalOpen) return;
    getMeetingsByRoom(roomId).then(({ meetings: fetched }) => {
      if (fetched) setTodayMeetings(fetched);
    });
  }, [refreshKey]);

  const hasAvailableSlots = calcHasAvailableSlots(meetings);
  const todayHasAvailableSlots = calcHasAvailableSlots(todayMeetings);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDateState(startOfToday());
    setSelectedTimeState(null);
    setSelectedDurationState(null);
  };

  const setSelectedDate = (date: Date) => {
    setSelectedDateState(date);
    setSelectedTimeState(null);
    setSelectedDurationState(null);
    getMeetingsByRoom(roomId, date.toISOString()).then(({ meetings: fetched }) => {
      if (fetched) setMeetings(fetched);
    });
  };

  const setSelectedTime = (time: string) => {
    setSelectedTimeState(time);

    if (selectedDuration) {
      const now = new Date();
      const slotStart = parse(time, "HH:mm", now);
      const nextMeeting =
        meetings.find((m) => new Date(m.start_time) >= slotStart) ?? null;
      const availability = calculateAvailableDurations(nextMeeting);

      const isDurationStillValid =
        !availability.isOngoingMeeting &&
        availability.availableMinutes >= Number(selectedDuration);

      if (!isDurationStillValid) {
        setSelectedDurationState(null);
      }
    }
  };

  const setSelectedDuration = (dur: string) => setSelectedDurationState(dur);

  const resetFlow = () => {
    setIsModalOpen(false);
    setSelectedDateState(startOfToday());
    setSelectedTimeState(null);
    setSelectedDurationState(null);
    setShowSuccess(false);
    setSuccessData(null);
    getMeetingsByRoom(roomId).then(({ meetings: fetched }) => {
      if (fetched) setMeetings(fetched);
    });
  };

  const setBookingSuccess = (data: SuccessData) => {
    setShowSuccess(true);
    setSuccessData(data);
  };

  return (
    <BookingContext.Provider
      value={{
        isModalOpen,
        isSubmitting,
        selectedDate,
        selectedTime,
        selectedDuration,
        meetings,
        todayMeetings,
        showSuccess,
        successData,
        hasAvailableSlots,
        todayHasAvailableSlots,
        openModal,
        closeModal,
        setSelectedDate,
        setSelectedTime,
        setSelectedDuration,
        resetFlow,
        setBookingSuccess,
        setIsSubmitting,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookingContext must be used within BookingProvider");
  return ctx;
}
