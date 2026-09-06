"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { EVENT, PROGRAMME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Download, Video, Calendar, Award, BookOpen, LogOut, CheckCircle2, Clock, MapPin, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [qr, setQr] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("clu_session_code") || localStorage.getItem("clu_session");
    if (raw) {
      const d = JSON.parse(raw);
      setUser(d);
      const token = d.qr_token || d.qrToken || d.access_code || d.accessCode;
      QRCode.toDataURL(JSON.stringify({ t: token, e: d.email }), {
        width: 300, margin: 1, color: { dark: "#4C1769", light: "#ffffff" }
      }).then(setQr).catch(() => {});
    }
  }, []);

  function signOut() {
    sessionStorage.removeItem("clu_session_code");
    localStorage.removeItem("clu_session");
    location.href = "/portal";
  }

  if (!user) return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-black">Not signed in</h1>
      <p className="text-sm text-zinc-600 mt-2">Please sign in with your access code or email.</p>
      <Link href="/portal" className="mt-6 inline-flex"><Button>Go to Sign In</Button></Link>
    </div>
  );

  const name = user.first_name ? `${user.first_name} ${user.surname || ""}`.trim() : user.name || "Participant";
  const accessCode = user.access_code || user.accessCode;
  const mode = user.participation_mode || user.mode || "Physical";

  return (
    <div className="bg-[#F8F5FF] py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
        {/* Welcome header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black">Welcome, {name}!</h1>
            <p className="text-sm text-zinc-600">{mode} participant • Access code: <b className="tracking-widest font-mono">{accessCode}</b></p>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold bg-white">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        {/* Access Pass — BIG */}
        <div className="rounded-[24px] bg-white border border-purple-100 shadow-xl p-6">
          <h2 className="font-bold text-lg flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#0E7C3E]" /> Your Access Pass</h2>
          <div className="mt-4 rounded-2xl border-2 border-dashed border-[#C9B676] bg-[#FFFBEB] p-6 text-center">
            <div className="text-xs font-bold tracking-[0.2em] text-[#4C1769]">ACCESS CODE</div>
            <div className="text-4xl font-black tracking-[0.14em] text-[#4C1769] mt-1 select-all">{accessCode}</div>
            {qr && <img src={qr} alt="QR Code" className="mx-auto mt-4 h-48 w-48 border-8 border-white rounded-2xl shadow" />}
            <p className="text-xs text-zinc-600 mt-3">Show QR at check-in on {EVENT.date} • Keep code private</p>
          </div>
        </div>

        {/* Quick actions — everything accessible */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/programme" className="rounded-2xl bg-[#4C1769] text-white p-4 text-center hover:shadow-lg transition">
            <Calendar className="h-6 w-6 mx-auto text-[#C9B676]" />
            <div className="text-sm font-bold mt-2">Programme</div>
            <div className="text-xs text-white/70">Full timeline + .ics</div>
          </Link>
          <Link href="/materials" className="rounded-2xl bg-white border border-purple-100 p-4 text-center hover:shadow-lg transition">
            <BookOpen className="h-6 w-6 mx-auto text-[#4C1769]" />
            <div className="text-sm font-bold mt-2">Materials</div>
            <div className="text-xs text-zinc-500">Lecture, slides, resources</div>
          </Link>
          <Link href="/certificate/verify/demo" className="rounded-2xl bg-white border border-purple-100 p-4 text-center hover:shadow-lg transition">
            <Award className="h-6 w-6 mx-auto text-[#C9B676]" />
            <div className="text-sm font-bold mt-2">Certificate</div>
            <div className="text-xs text-zinc-500">Verify & download</div>
          </Link>
          <a href={EVENT.zoomUrl} target="_blank" className="rounded-2xl bg-[#25D366] text-white p-4 text-center hover:shadow-lg transition">
            <Video className="h-6 w-6 mx-auto" />
            <div className="text-sm font-bold mt-2">Join Zoom</div>
            <div className="text-xs text-white/80">15 Oct 09:00 WAT</div>
          </a>
        </div>

        {/* Programme preview */}
        <div className="rounded-[24px] bg-white border border-purple-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2"><Clock className="h-5 w-5 text-[#4C1769]" /> Programme</h2>
            <Link href="/programme" className="text-sm font-bold text-[#4C1769] flex items-center gap-1">Full programme <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="space-y-2">
            {PROGRAMME.map((it) => (
              <div key={it.time} className="flex gap-3 rounded-xl border border-zinc-100 p-3">
                <div className="shrink-0 rounded-lg bg-[#4C1769] text-white px-3 py-1.5 text-center min-w-[90px]">
                  <div className="text-xs font-bold">{it.time.split(" ")[0]}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold leading-tight">{it.title}</div>
                  <div className="text-xs text-[#C9B676] font-semibold">{it.speaker}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event details */}
        <div className="rounded-[24px] bg-[#4C1769] text-white p-6">
          <h3 className="font-bold text-lg">Event Details</h3>
          <div className="mt-3 grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-[#C9B676] font-bold text-xs tracking-widest">DATE & TIME</div>
              <div className="mt-1">{EVENT.date}</div>
              <div className="text-white/70">{EVENT.startTime}</div>
            </div>
            <div>
              <div className="text-[#C9B676] font-bold text-xs tracking-widest">VENUE</div>
              <div className="mt-1">{EVENT.venue}</div>
            </div>
            <div>
              <div className="text-[#C9B676] font-bold text-xs tracking-widest">ZOOM</div>
              <div className="mt-1">{EVENT.zoomTopic}</div>
              <div className="text-white/70">{EVENT.zoomTime}</div>
            </div>
            <div>
              <div className="text-[#C9B676] font-bold text-xs tracking-widest">CONTACT</div>
              <div className="mt-1">{EVENT.phone}</div>
              <div className="text-white/70">{EVENT.email}</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={EVENT.phoneHref} className="rounded-full bg-white text-[#4C1769] px-5 py-2.5 text-sm font-bold">Call Us</a>
            <a href={`${EVENT.whatsappHref}?text=${encodeURIComponent(EVENT.whatsappPrefill)}`} target="_blank" className="rounded-full bg-[#25D366] text-white px-5 py-2.5 text-sm font-bold">WhatsApp</a>
          </div>
        </div>

        {/* Certificate status */}
        <div className="rounded-[24px] bg-white border border-purple-100 p-6">
          <h3 className="font-bold flex items-center gap-2"><Award className="h-5 w-5 text-[#C9B676]" /> Certificate</h3>
          <p className="text-sm text-zinc-600 mt-1">Available after verified attendance and admin issuance. You'll be notified when ready.</p>
          <div className="mt-3 rounded-xl bg-zinc-50 border px-4 py-3 text-sm">
            Status: <b>Attendance not yet verified</b> — show your QR at check-in
          </div>
        </div>
      </div>
    </div>
  );
}
