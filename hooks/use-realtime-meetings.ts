"use client";

import { useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

type RealtimePayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Record<string, unknown>;
  old: Record<string, unknown>;
};

type UseRealtimeMeetingsOptions = {
  roomId?: string;
  onInsert?: (payload: RealtimePayload) => void;
  onUpdate?: (payload: RealtimePayload) => void;
  onDelete?: (payload: RealtimePayload) => void;
  onAnyChange?: (payload: RealtimePayload) => void;
};

/**
 * Hook to subscribe to real-time meeting (bookings) changes from Supabase
 * Automatically refreshes data when meetings are created, updated, or deleted
 */
export function useRealtimeMeetings({
  roomId,
  onInsert,
  onUpdate,
  onDelete,
  onAnyChange,
}: UseRealtimeMeetingsOptions = {}) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  const subscribe = useCallback(() => {
    const supabase = createClient();

    // Unsubscribe from existing channel if any
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create unique channel name
    const channelName = roomId
      ? `bookings-room-${roomId}`
      : `bookings-all-${Date.now()}`;

    // Build the channel subscription
    let channel = supabase.channel(channelName);

    // Subscribe to all changes on bookings table
    // Filter by room_id if provided
    if (roomId) {
      channel = channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const realtimePayload: RealtimePayload = {
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
            new: payload.new as Record<string, unknown>,
            old: payload.old as Record<string, unknown>,
          };

          // Call specific handlers
          if (payload.eventType === "INSERT" && onInsert) {
            onInsert(realtimePayload);
          } else if (payload.eventType === "UPDATE" && onUpdate) {
            onUpdate(realtimePayload);
          } else if (payload.eventType === "DELETE" && onDelete) {
            onDelete(realtimePayload);
          }

          // Always call the general change handler
          if (onAnyChange) {
            onAnyChange(realtimePayload);
          }
        }
      );
    } else {
      channel = channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          const realtimePayload: RealtimePayload = {
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
            new: payload.new as Record<string, unknown>,
            old: payload.old as Record<string, unknown>,
          };

          // Call specific handlers
          if (payload.eventType === "INSERT" && onInsert) {
            onInsert(realtimePayload);
          } else if (payload.eventType === "UPDATE" && onUpdate) {
            onUpdate(realtimePayload);
          } else if (payload.eventType === "DELETE" && onDelete) {
            onDelete(realtimePayload);
          }

          // Always call the general change handler
          if (onAnyChange) {
            onAnyChange(realtimePayload);
          }
        }
      );
    }

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log(`Realtime subscription active for bookings${roomId ? ` (room: ${roomId})` : ""}`);
      }
    });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomId, onInsert, onUpdate, onDelete, onAnyChange]);

  useEffect(() => {
    const cleanup = subscribe();
    return cleanup;
  }, [subscribe]);

  return {
    resubscribe: subscribe,
  };
}
