"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getRoomById } from "@/actions/room";
import ThemeToggleButton from "./theme-toggle";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isRoomDetailPage =
    pathname?.startsWith("/rooms/") && pathname.split("/").length === 3;
  const roomId = isRoomDetailPage ? pathname.split("/")[2] : null;

  const [roomName, setRoomName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!roomId);

  const displayedRoomName = roomId ? roomName : null;

  useEffect(() => {
    if (!roomId) return;

    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) setIsLoading(true);
    });

    getRoomById(roomId)
      .then(({ room }) => {
        if (!cancelled) {
          setRoomName(room?.name ?? null);
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
    <nav className="sticky top-0 z-50 bg-transparent backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {isRoomDetailPage && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/")}
                className="shrink-0 border-white/40 bg-white/50 backdrop-blur-sm hover:bg-white/70 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              {isLoading ? (
                <div className="h-6 w-32 animate-pulse rounded bg-white/30 dark:bg-white/10" />
              ) : displayedRoomName ? (
                <h1 className="text-xl font-bold text-primary md:text-2xl lg:text-3xl">
                  {displayedRoomName}
                </h1>
              ) : null}
            </>
          )}
        </div>
        <ThemeToggleButton />
      </div>
    </nav>
  );
}
