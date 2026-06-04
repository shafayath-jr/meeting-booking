"use client";

import { getMeetingsByRoomForDateRange, getNextMeetingByRoom } from "@/actions/meeting";
import { useMeetingsContext } from "@/components/providers/meetings-provider";
import { TIME_SLOTS } from "@/lib/constants";
import { calculateAvailableDurations } from "@/lib/duration-helper";
import { Meeting } from "@/types/meeting";
import {
  addMinutes,
  endOfDay,
  isBefore,
  isToday,
  parse,
  startOfDay,
  startOfToday,
} from "date-fns";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
  showSuccess: boolean;
  successData: SuccessData | null;
  hasAvailableSlots: boolean;
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
  const meetingsRef = useRef(meetings);

  const { refreshKey } = useMeetingsContext();

  useEffect(() => {
    meetingsRef.current = meetings;
  }, [meetings]);

  const fetchMeetingsForDate = useCallback(
    async (date: Date) => {
      const { meetings: fetched } = await getMeetingsByRoomForDateRange(
        roomId,
        startOfDay(date).toISOString(),
        endOfDay(date).toISOString()
      );
      if (!fetched) return;

      if (process.env.NODE_ENV === "production") {
        const sample = fetched[0];
        console.log("[booking-context] now", new Date().toISOString());
        console.log("[booking-context] sample.start_time", sample?.start_time);
        console.log("[booking-context] sample.end_time", sample?.end_time);
        console.log(
          "[booking-context] parsed.start",
          sample?.start_time ? new Date(sample.start_time).toString() : "n/a"
        );
      }

      const now = new Date();
      const hasOngoing = fetched.some(
        (m) => new Date(m.start_time) <= now && new Date(m.end_time) > now
      );

      if (hasOngoing) {
        if (process.env.NODE_ENV === "production") {
          console.log("[booking-context] hasOngoing: true");
        }
        setMeetings(fetched);
        return;
      }

      const { meeting } = await getNextMeetingByRoom(roomId);
      const isOngoing =
        meeting &&
        new Date(meeting.start_time) <= now &&
        new Date(meeting.end_time) > now;

      const fallbackOngoing = meetingsRef.current.find(
        (m) => new Date(m.start_time) <= now && new Date(m.end_time) > now
      );

      const ongoingMeeting = isOngoing ? meeting : (fallbackOngoing ?? null);

      if (!ongoingMeeting) {
        if (process.env.NODE_ENV === "production") {
          console.log("[booking-context] hasOngoing: false");
        }
        setMeetings(fetched);
        return;
      }

      const merged = [ongoingMeeting, ...fetched].filter(
        (m, index, arr) => arr.findIndex((other) => other.id === m.id) === index
      );
      merged.sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
      setMeetings(merged);
    },
    [roomId]
  );

  useEffect(() => {
    if (isModalOpen) return;
    const id = setTimeout(() => {
      void fetchMeetingsForDate(selectedDate);
    }, 0);
    return () => clearTimeout(id);
  }, [fetchMeetingsForDate, isModalOpen, refreshKey, selectedDate]);

  const hasAvailableSlots = calcHasAvailableSlots(meetings);

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
    fetchMeetingsForDate(date);
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
    fetchMeetingsForDate(startOfToday());
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
        showSuccess,
        successData,
        hasAvailableSlots,
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
