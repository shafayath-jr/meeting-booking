"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Meeting } from "@/types/meeting";
import { getMeetingsByRoom } from "@/actions/meeting";

type ReceptionistBookingContextType = {
  selectedBuildingId: string | null;
  selectedRoomId: string | null;
  selectedDate: Date;
  selectedTime: string | null;
  selectedDuration: string | null;
  meetings: Meeting[];
  isLoadingMeetings: boolean;
  isSubmitting: boolean;
  setSelectedBuildingId: (id: string | null) => void;
  setSelectedRoomId: (id: string | null) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedTime: (time: string | null) => void;
  setSelectedDuration: (duration: string | null) => void;
  setIsSubmitting: (val: boolean) => void;
  triggerRefresh: () => void;
};

const ReceptionistBookingContext = createContext<ReceptionistBookingContextType | null>(
  null
);

export function ReceptionistBookingProvider({ children }: { children: ReactNode }) {
  const [selectedBuildingId, setSelectedBuildingIdState] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomIdState] = useState<string | null>(null);
  const [selectedDate, setSelectedDateState] = useState<Date>(() => new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const setSelectedBuildingId = useCallback((id: string | null) => {
    setSelectedBuildingIdState(id);
    setSelectedRoomIdState(null);
    setSelectedTime(null);
    setSelectedDuration(null);
    setMeetings([]);
    setLoadedKey(null);
  }, []);

  const setSelectedRoomId = useCallback((id: string | null) => {
    setSelectedRoomIdState(id);
    setSelectedTime(null);
    setSelectedDuration(null);
  }, []);

  const setSelectedDate = useCallback((date: Date) => {
    setSelectedDateState(date);
    setSelectedTime(null);
    setSelectedDuration(null);
  }, []);

  const dateKey = selectedDate.toISOString();
  const targetKey = selectedRoomId ? `${selectedRoomId}:${dateKey}:${refreshKey}` : null;

  useEffect(() => {
    if (!selectedRoomId || !targetKey) return;

    let cancelled = false;
    getMeetingsByRoom(selectedRoomId, dateKey).then(({ meetings: fetched }) => {
      if (cancelled) return;
      setMeetings(fetched ?? []);
      setLoadedKey(targetKey);
    });

    return () => {
      cancelled = true;
    };
  }, [selectedRoomId, dateKey, targetKey]);

  const isLoadingMeetings = !!targetKey && loadedKey !== targetKey;

  return (
    <ReceptionistBookingContext.Provider
      value={{
        selectedBuildingId,
        selectedRoomId,
        selectedDate,
        selectedTime,
        selectedDuration,
        meetings,
        isLoadingMeetings,
        isSubmitting,
        setSelectedBuildingId,
        setSelectedRoomId,
        setSelectedDate,
        setSelectedTime,
        setSelectedDuration,
        setIsSubmitting,
        triggerRefresh,
      }}
    >
      {children}
    </ReceptionistBookingContext.Provider>
  );
}

export function useReceptionistBooking() {
  const ctx = useContext(ReceptionistBookingContext);
  if (!ctx) {
    throw new Error(
      "useReceptionistBooking must be used within ReceptionistBookingProvider"
    );
  }
  return ctx;
}
