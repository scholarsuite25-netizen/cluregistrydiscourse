"use client";
import { PROGRAMME, EVENT } from "@/lib/constants";
import Link from "next/link";
import { Calendar, Clock, MapPin, Download } from "lucide-react";

export default function ProgrammePage() {
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CLU//Registry Discourse//EN
BEGIN:VEVENT
UID:clu-registry-discourse-2026@chrislanduniversity.edu.ng
DTSTAMP:20261001T080000Z
DTSTART:20261015T080000Z
DTEND:20261015T123000Z
SUMMARY:CLU Registry Discourse — Governance, Innovation and Service
DESCRIPTION:Maiden Registry Discourse of Chrisland University\\nVenue: ${EVENT.venue}
LOCATION:${EVENT.venue}
END:VEVENT
END:VCALENDAR`;

  return (
    <div className="bg-[#F8F5FF] py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Programme</h1>
            <p className="text-sm text-zinc-600 mt-1">{EVENT.date} • {EVENT.startTime} • Africa/Lagos • {EVENT.venue}</p>
          </div>
          <div className="flex gap-2">
            <a href={`data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`} download="CLU-Registry-Discourse-2026.ics" className="inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-5 py-2.5 text-sm font-bold"><Calendar className="h-4 w-4" /> Add to Calendar (.ics)</a>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border bg-white px-5 py-2.5 text-sm font-bold"><Download className="h-4 w-4" /> Print / Save PDF</button>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] bg-white border border-purple-100 shadow-sm p-6">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#4C1769]"><Clock className="h-4 w-4" /> TIMELINE • VERSION 1.0 • LAST UPDATED 06 SEP 2026</div>
          <div className="mt-4 space-y-3">
            {PROGRAMME.map((it) => (
              <div key={it.time} className="flex gap-3 sm:gap-4 rounded-2xl border border-zinc-100 bg-white p-4 hover:border-purple-200 transition">
                <div className="hidden sm:block h-fit rounded-xl bg-[#4C1769] text-white px-3 py-2 text-center min-w-[118px]">
                  <div className="text-xs font-bold tracking-widest">{it.time}</div>
                  <div className="text-[11px] opacity-70 flex items-center justify-center gap-1"><MapPin className="h-3 w-3" /> {it.venue}</div>
                </div>
                <div className="sm:hidden rounded-xl bg-[#4C1769] text-white px-3 py-1.5 text-xs font-bold self-start">{it.time}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm sm:text-[15px] leading-tight">{it.title}</div>
                  <div className="text-xs font-semibold text-[#C9B676]">{it.speaker}</div>
                  <div className="text-sm text-zinc-600 mt-1">{it.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-4">Programme is admin-editable, reorderable and publishable without code changes. Download as PDF from participant portal when published.</p>
        </div>

        <div className="mt-6 rounded-[24px] bg-[#4C1769] text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black">Need to check in?</h3>
            <p className="text-sm text-white/80">Physical: show QR at foyer • Online: enter the attendance word announced on Zoom</p>
          </div>
          <Link href="/register" className="rounded-full bg-[#C9B676] text-[#4C1769] px-6 py-3 text-sm font-black">Register now</Link>
        </div>
      </div>
    </div>
  );
}
