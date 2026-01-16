"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useParams } from "next/navigation";
import { useRealtimeMeetings } from "@/hooks/use-realtime-meetings";

type MeetingsContextType = {
  refreshKey: number;
  triggerRefresh: () => void;
};

const MeetingsContext = createContext<MeetingsContextType | null>(null);

type MeetingsProviderProps = {
  children: ReactNode;
};

export function MeetingsProvider({ children }: MeetingsProviderProps) {
  const params = useParams<{ id?: string }>();
  const roomId = params?.id;
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Subscribe to real-time changes for this room
  useRealtimeMeetings({
    roomId,
    onAnyChange: () => {
      // Trigger refresh whenever any booking change occurs
      triggerRefresh();
    },
  });

  return (
    <MeetingsContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </MeetingsContext.Provider>
  );
}

export function useMeetingsContext() {
  const context = useContext(MeetingsContext);
  if (!context) {
    throw new Error("useMeetingsContext must be used within a MeetingsProvider");
  }
  return context;
}
