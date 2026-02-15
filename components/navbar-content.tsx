"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getRoomById } from "@/actions/room";
import ThemeToggleButton from "./theme-toggle";

export default function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [roomName, setRoomName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if we're on a room detail page
  const isRoomDetailPage = pathname?.startsWith("/rooms/") && pathname.split("/").length === 3;
  const roomId = isRoomDetailPage ? pathname.split("/")[2] : null;

  useEffect(() => {
    let cancelled = false;

    if (!roomId) {
      // Defer setState to avoid synchronous call in effect
      queueMicrotask(() => {
        if (!cancelled) setRoomName(null);
      });
      return () => {
        cancelled = true;
      };
    }

    // Use queueMicrotask to defer setState
    queueMicrotask(() => {
      if (!cancelled) setIsLoading(true);
    });

    getRoomById(roomId)
      .then(({ room }) => {
        if (!cancelled) {
          setRoomName(room?.name || null);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRoomName(null);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [roomId]);

  return (
    <div className="sticky z-50 backdrop-blur-sm bg-transparent">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isRoomDetailPage && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/")}
                className="shrink-0 bg-white/50 dark:bg-white/10 backdrop-blur-sm border-white/40 dark:border-white/20 hover:bg-white/70 dark:hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              {isLoading ? (
                <div className="h-6 w-32 bg-white/30 dark:bg-white/10 animate-pulse rounded" />
              ) : roomName ? (
                <h1 className="text-xl md:text-2xl lg:text-3xl text-primary font-bold">
                  {roomName}
                </h1>
              ) : null}
            </>
          )}
        </div>
        <ThemeToggleButton />
      </nav>
    </div>
  );
}
