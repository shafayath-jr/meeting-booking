"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = format(now, "hh:mm");
  const ampm = format(now, "aa");
  const date = format(now, "EEEE, MMMM d, yyyy");

  return (
    <div className="mb-8 text-black">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-8xl leading-none font-light tracking-tight">
          {time}
        </span>
        <div className="flex flex-col">
          <span className="text-xl font-semibold tracking-widest text-black/60 uppercase">
            {ampm}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-black/15" />
        <p className="text-[11px] font-semibold tracking-[0.22em] text-black/45 uppercase">
          {date}
        </p>
        <div className="h-px flex-1 bg-black/15" />
      </div>
    </div>
  );
}
