"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { format, isAfter, isBefore, isSameDay, startOfToday } from "date-fns";
import { Meeting } from "@/types/meeting";
import { getMeetingsByRoomForDateRange } from "@/actions/meeting";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getNextBoundary } from "@/lib/utils";
import { useMeetingsContext } from "@/components/providers/meetings-provider";
import MeetingCard from "./meeting-card";
import OngoingMeetingIndicator from "./ongoing-meeting-indicator";

interface MeetingsListProps {
  onMeetingClick?: (meeting: Meeting) => void;
  className?: string;
}

export default function MeetingsList({ onMeetingClick, className }: MeetingsListProps) {
  const { id: roomId } = useParams<{ id: string }>();
  const { refreshKey } = useMeetingsContext();
  const [allFetchedMeetings, setAllFetchedMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Re-render only at meeting boundaries (start/end), not every second
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
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);

        const { meetings } = await getMeetingsByRoomForDateRange(
          roomId,
          startOfToday().toISOString(),
          futureDate.toISOString()
        );

        const sorted = (meetings || []).sort(
          (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        setAllFetchedMeetings(sorted);
      } catch (error) {
        console.error("Failed to fetch meetings:", error);
        setAllFetchedMeetings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [roomId, refreshKey]);

  const ongoingMeeting = useMemo(() => {
    return (
      allFetchedMeetings.find((meeting) => {
        const start = new Date(meeting.start_time);
        const end = new Date(meeting.end_time);
        return isBefore(start, currentTime) && isAfter(end, currentTime);
      }) || null
    );
  }, [allFetchedMeetings, currentTime]);

  const upcomingMeetings = useMemo(() => {
    return allFetchedMeetings.filter((meeting) =>
      isAfter(new Date(meeting.start_time), currentTime)
    );
  }, [allFetchedMeetings, currentTime]);

  const meetingsByDate = useMemo(() => {
    const grouped = new Map<string, Meeting[]>();
    upcomingMeetings.forEach((meeting) => {
      const dateKey = format(new Date(meeting.start_time), "yyyy-MM-dd");
      if (!grouped.has(dateKey)) grouped.set(dateKey, []);
      grouped.get(dateKey)!.push(meeting);
    });
    return Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [upcomingMeetings]);

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <h2 className="mb-4 text-lg font-semibold">Upcoming Meetings</h2>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="mb-4 shrink-0">
        <h2 className="text-lg font-semibold">Upcoming Meetings</h2>
        <p className="text-sm text-muted-foreground">
          {ongoingMeeting ? "1 meeting in progress • " : ""}
          {upcomingMeetings.length} upcoming meeting
          {upcomingMeetings.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {ongoingMeeting && (
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-linear-to-r from-emerald-500/60 to-transparent" />
              <h3 className="px-2 text-xs font-semibold tracking-wider text-emerald-600 uppercase">
                Now
              </h3>
              <div className="h-px flex-1 bg-linear-to-l from-emerald-500/60 to-transparent" />
            </div>
            <OngoingMeetingIndicator
              meeting={ongoingMeeting}
              onMeetingClick={onMeetingClick}
            />
          </div>
        )}

        {upcomingMeetings.length === 0 && !ongoingMeeting ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No upcoming meetings</p>
          </div>
        ) : upcomingMeetings.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            <p className="text-sm">No more meetings scheduled</p>
          </div>
        ) : (
          <div className="space-y-6 pr-2">
            {meetingsByDate.map(([dateKey, dateMeetings]) => {
              const date = new Date(dateKey);
              const isToday = isSameDay(date, new Date());

              return (
                <div key={dateKey} className="space-y-3">
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-px flex-1 bg-linear-to-r from-border/60 to-transparent" />
                    <h3 className="px-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                      {isToday ? "Today" : format(date, "EEEE, MMMM d")}
                    </h3>
                    <div className="h-px flex-1 bg-linear-to-l from-border/60 to-transparent" />
                  </div>
                  <div className="space-y-3">
                    {dateMeetings.map((meeting) => (
                      <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        onMeetingClick={onMeetingClick}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
