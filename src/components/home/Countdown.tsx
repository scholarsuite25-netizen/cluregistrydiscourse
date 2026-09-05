"use client";
import { useEffect, useState } from "react";
import { EVENT } from "@/lib/constants";

export function Countdown() {
  const target = new Date(EVENT.dateISO).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return <div className="h-[88px]" />;
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const items = [
    { v: d, l: "Days" },
    { v: h, l: "Hours" },
    { v: m, l: "Minutes" },
    { v: s, l: "Seconds" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {items.map((it) => (
        <div key={it.l} className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 text-center px-2 py-3 sm:px-4 sm:py-4">
          <div className="text-xl sm:text-2xl font-black tabular-nums text-white">{String(it.v).padStart(2, "0")}</div>
          <div className="text-[10px] sm:text-xs tracking-widest font-bold text-white/70 uppercase">{it.l}</div>
        </div>
      ))}
    </div>
  );
}
