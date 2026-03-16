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
  const date = format(now, "EEEE MMMM d, yyyy");

  return (
    <div className="mb-10 rounded-2xl text-secondary">
      <div className="flex items-start gap-2">
        <span className="text-7xl leading-none font-bold tracking-tight">{time}</span>
        <span className="mt-1 text-2xl font-semibold">{ampm}</span>
      </div>
      <p className="text-lg font-light">{date}</p>
    </div>
  );
}
