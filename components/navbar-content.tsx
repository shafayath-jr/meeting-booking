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
    if (roomId) {
      setIsLoading(true);
      getRoomById(roomId)
        .then(({ room }) => {
          setRoomName(room?.name || null);
        })
        .catch(() => {
          setRoomName(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setRoomName(null);
    }
  }, [roomId]);

  return (
    <div className="bg-transparent">
      <nav className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isRoomDetailPage && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/")}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              {isLoading ? (
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
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
