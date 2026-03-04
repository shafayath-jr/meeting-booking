"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Meeting } from "@/types/meeting";

export type SuccessData = {
  subject: string;
  hostName: string;
  startTime: Date;
  endTime: Date;
};

type BookingContextType = {
  step: 0 | 1 | 2 | 3;
  selectedTime: string | null;
  selectedDuration: string | null;
  meetings: Meeting[];
  showSuccess: boolean;
  successData: SuccessData | null;
  setSelectedTime: (time: string) => void;
  setSelectedDuration: (dur: string) => void;
  startBookingFlow: () => void;
  resetFlow: () => void;
  setBookingSuccess: (data: SuccessData) => void;
};

const BookingContext = createContext<BookingContextType | null>(null);

type BookingProviderProps = {
  children: ReactNode;
  meetings: Meeting[];
};

export function BookingProvider({ children, meetings }: BookingProviderProps) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [selectedTime, setSelectedTimeState] = useState<string | null>(null);
  const [selectedDuration, setSelectedDurationState] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const setSelectedTime = (time: string) => {
    setSelectedTimeState(time);
    setStep(2);
  };

  const setSelectedDuration = (dur: string) => {
    setSelectedDurationState(dur);
    setStep(3);
  };

  const startBookingFlow = () => setStep(1);

  const resetFlow = () => {
    setStep(0);
    setSelectedTimeState(null);
    setSelectedDurationState(null);
    setShowSuccess(false);
    setSuccessData(null);
  };

  const setBookingSuccess = (data: SuccessData) => {
    setShowSuccess(true);
    setSuccessData(data);
  };

  return (
    <BookingContext.Provider
      value={{
        step,
        selectedTime,
        selectedDuration,
        meetings,
        showSuccess,
        successData,
        setSelectedTime,
        setSelectedDuration,
        startBookingFlow,
        resetFlow,
        setBookingSuccess,
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
