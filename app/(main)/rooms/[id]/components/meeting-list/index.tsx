"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { isAfter, isBefore, startOfToday, endOfToday } from "date-fns";
import { Meeting } from "@/types/meeting";
import { getMeetingsByRoomForDateRange } from "@/actions/meeting";
import { Skeleton } from "@/components/ui/skeleton";
import { getNextBoundary } from "@/lib/utils";
import { useMeetingsContext } from "@/components/providers/meetings-provider";
import MeetingInfoCard from "./meeting-info-card";

export default function MeetingList() {
  const { id: roomId } = useParams<{ id: string }>();
  const { refreshKey } = useMeetingsContext();
  const [allFetchedMeetings, setAllFetchedMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const nextBoundary = getNextBoundary(allFetchedMeetings, currentTime);
    if (!nextBoundary) return;
    const delay = nextBoundary.getTime() - Date.now();
    const id = setTimeout(() => setCurrentTime(new Date()), delay + 50);
    return () => clearTimeout(id);
  }, [allFetchedMeetings, currentTime]);

  useEffect(() => {
    const fetchMeetings = async () => {
      setIsLoading(true);
      try {
        const { meetings } = await getMeetingsByRoomForDateRange(
          roomId,
          startOfToday().toISOString(),
          endOfToday().toISOString()
        );
        const sorted = (meetings || []).sort(
          (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        setAllFetchedMeetings(sorted);
      } catch {
        setAllFetchedMeetings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [roomId, refreshKey]);

  const ongoingMeeting = useMemo(
    () =>
      allFetchedMeetings.find((m) => {
        const start = new Date(m.start_time);
        const end = new Date(m.end_time);
        return isBefore(start, currentTime) && isAfter(end, currentTime);
      }) || null,
    [allFetchedMeetings, currentTime]
  );

  const upcomingMeetings = useMemo(
    () => allFetchedMeetings.filter((m) => isAfter(new Date(m.start_time), currentTime)),
    [allFetchedMeetings, currentTime]
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 bg-black/10" />
        ))}
      </div>
    );
  }

  if (!ongoingMeeting && upcomingMeetings.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-white/60">
        No meetings scheduled today
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {ongoingMeeting && <MeetingInfoCard meeting={ongoingMeeting} status="Ongoing" />}
      {upcomingMeetings.map((meeting) => (
        <MeetingInfoCard key={meeting.id} meeting={meeting} status="Upcoming" />
      ))}
    </div>
  );
}
