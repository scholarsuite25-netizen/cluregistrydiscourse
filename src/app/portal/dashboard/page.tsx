"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { EVENT, PROGRAMME } from "@/lib/constants";
import { Download, Video, Calendar, Award, BookOpen, LogOut, CheckCircle2, Clock, MapPin, ArrowRight, User, Mail, Phone, Building2, CreditCard } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [qr, setQr] = useState("");

  useEffect(() => {
    // Check localStorage first (persistent), then sessionStorage
    const raw = localStorage.getItem("clu_registration") || sessionStorage.getItem("clu_session_code") || localStorage.getItem("clu_session");
    if (raw) {
      const d = JSON.parse(raw);
      setUser(d);
      const token = d.access_code || d.accessCode;
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
      <Link href="/portal" className="mt-6 inline-flex"><span className="inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-5 py-2.5 text-sm font-bold">Go to Sign In</span></Link>
    </div>
  );

  const name = user.first_name ? `${user.first_name} ${user.surname || ""}`.trim() : user.name || "Participant";
  const accessCode = user.access_code || user.accessCode;
  const mode = user.participation_mode || user.mode || "Physical";
  const email = user.email || "";
  const phone = user.phone || "";
  const institution = user.institution || "";
  const designation = user.designation || "";

  return (
    <div className="bg-[#F8F5FF] py-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-6">
        {/* Welcome header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black">Welcome, {name}!</h1>
            <p className="text-sm text-zinc-600">{mode} participant</p>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold bg-white">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        {/* ============================================ */}
        {/* PERSISTENT ACCESS PASS — FULL DETAILS        */}
        {/* ============================================ */}
        <div className="rounded-[32px] bg-white border-2 border-[#C9B676] shadow-2xl overflow-hidden">
          {/* Header strip */}
          <div className="bg-[#4C1769] text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#C9B676]" />
              <span className="font-black text-sm tracking-widest">OFFICIAL ACCESS PASS</span>
            </div>
            <span className="text-xs text-white/70">CLU REGISTRY DISCOURSE 2026</span>
          </div>

          {/* Main pass body */}
          <div className="p-6 sm:p-8">
            <div className="grid sm:grid-cols-[1fr_200px] gap-6 items-start">
              {/* Left — Participant details */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold tracking-widest text-[#4C1769] mb-1">PARTICIPANT NAME</div>
                  <div className="text-xl font-black text-[#1A0B2E] leading-tight">{name}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-bold tracking-widest text-[#4C1769] mb-1">EMAIL</div>
                    <div className="text-sm text-zinc-700 flex items-center gap-1"><Mail className="h-3 w-3" /> {email}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-widest text-[#4C1769] mb-1">PHONE</div>
                    <div className="text-sm text-zinc-700 flex items-center gap-1"><Phone className="h-3 w-3" /> {phone}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-widest text-[#4C1769] mb-1">INSTITUTION</div>
                    <div className="text-sm text-zinc-700 flex items-center gap-1"><Building2 className="h-3 w-3" /> {institution}</div>
                  </div>
                  {designation && (
                    <div>
                      <div className="text-xs font-bold tracking-widest text-[#4C1769] mb-1">DESIGNATION</div>
                      <div className="text-sm text-zinc-700">{designation}</div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-xs font-bold text-[#4C1769]">
                    {mode === "Physical" ? "🏛️ Physical Attendance" : "💻 Online via Zoom"}
                  </span>
                  <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-[#0E7C3E]">
                    ✓ Registration Confirmed
                  </span>
                </div>
              </div>

              {/* Right — QR Code + Access Code */}
              <div className="flex flex-col items-center">
                {qr && (
                  <div className="rounded-2xl border-4 border-[#4C1769] bg-white p-3 shadow-lg">
                    <img src={qr} alt="QR Code" className="h-40 w-40" />
                  </div>
                )}
                <div className="mt-3 text-center">
                  <div className="text-xs font-bold tracking-widest text-[#4C1769]">ACCESS CODE</div>
                  <div className="text-2xl font-black tracking-[0.14em] text-[#4C1769] mt-1 select-all font-mono">{accessCode}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer instruction strip */}
          <div className="bg-[#FFFBEB] border-t-2 border-[#C9B676] px-6 py-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#4C1769]">
              <CheckCircle2 className="h-4 w-4 text-[#0E7C3E]" />
              Show this pass at the venue entrance on <b>{EVENT.date}</b>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 rounded-full bg-[#4C1769] text-white px-4 py-2 text-xs font-bold"
              >
                <Download className="h-3 w-3" /> Print Pass
              </button>
            </div>
          </div>
        </div>

        {/* Quick actions */}
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
