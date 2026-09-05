"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { EVENT } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Download, Video, Calendar, Award, BookOpen, LogOut, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [qr, setQr] = useState("");
  const [zoomReleased] = useState(false); // admin-configurable; default locked until event day

  useEffect(() => {
    const raw = sessionStorage.getItem("clu_session_code") || localStorage.getItem("clu_session") || sessionStorage.getItem("clu_success");
    if (raw) {
      const d = JSON.parse(raw);
      setUser(d);
      const token = d.qr_token || d.qrToken || d.access_code || d.accessCode;
      QRCode.toDataURL(JSON.stringify({ t: token, e: d.email }), { width: 300, margin: 1, color: { dark: "#4C1769", light: "#ffffff" } }).then(setQr).catch(() => {});
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
      <p className="text-sm text-zinc-600 mt-2">Please sign in via email magic link or access code.</p>
      <Link href="/portal" className="mt-6 inline-flex"><Button>Go to Portal</Button></Link>
    </div>
  );

  const name = user.first_name ? `${user.first_name} ${user.surname || ""}`.trim() : user.name || "Participant";
  const accessCode = user.access_code || user.accessCode;
  const mode = user.participation_mode || user.mode || "Physical";

  return (
    <div className="bg-[#F8F5FF] py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black">Welcome, {name}</h1>
            <p className="text-sm text-zinc-600">{user.email} • {mode} • Access code: <b className="tracking-widest">{accessCode}</b></p>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold bg-white"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="rounded-[24px] bg-white border border-purple-100 shadow-xl p-6">
            <h2 className="font-bold">Your access pass</h2>
            <div className="mt-4 rounded-2xl border-2 border-dashed border-[#C9B676] bg-[#FFFBEB] p-6 text-center">
              <div className="text-xs font-bold tracking-[0.2em] text-[#4C1769]">ACCESS CODE</div>
              <div className="text-3xl font-black tracking-[0.14em] text-[#4C1769] mt-1">{accessCode}</div>
              {qr && <img src={qr} alt="QR" className="mx-auto mt-4 h-52 w-52 border-8 border-white rounded-2xl shadow" />}
              <p className="text-xs text-zinc-600 mt-3">Show at physical check-in • Keep private</p>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-2">
              <a href="/registration/success" className="rounded-full bg-[#4C1769] text-white text-center py-3 text-sm font-bold flex items-center justify-center gap-2"><Download className="h-4 w-4" /> Download pass</a>
              <button onClick={() => { if ("Notification" in window) Notification.requestPermission(); }} className="rounded-full border-2 border-[#4C1769] text-[#4C1769] py-3 text-sm font-bold">Enable push notifications</button>
            </div>
            <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-xs flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> Attendance is required for certificate eligibility. Check in via QR or attendance word (online).</div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] bg-[#4C1769] text-white p-6">
              <h3 className="font-bold flex items-center gap-2"><Video className="h-4 w-4 text-[#C9B676]" /> Zoom access (Online participants)</h3>
              {zoomReleased ? (
                <a href={EVENT.zoomUrl} target="_blank" className="mt-3 inline-flex rounded-full bg-[#C9B676] text-[#4C1769] px-5 py-2.5 text-sm font-black">Join Zoom — 15 Oct 09:00 WAT</a>
              ) : (
                <p className="mt-3 text-sm text-white/80">Zoom join link will be released here at the admin-configured time (seed: 9:00 a.m. WAT opening). A calendar invite (.ics) is available on the Programme page. No join URL is exposed in public source.</p>
              )}
              <p className="text-xs text-white/60 mt-2">Topic: {EVENT.zoomTopic}</p>
            </div>

            <div className="rounded-[24px] bg-white border p-5">
              <h3 className="font-bold flex items-center gap-2"><Award className="h-4 w-4 text-[#C9B676]" /> Certificate</h3>
              <p className="text-sm text-zinc-600 mt-1">Available after verified attendance and admin issuance. You’ll be notified via email/push when ready.</p>
              <div className="mt-3 rounded-xl bg-zinc-50 border px-3 py-2 text-xs">Status: <b>Attendance not yet verified</b> • Keep your QR ready</div>
            </div>

            <div className="rounded-[24px] bg-white border p-5">
              <h3 className="font-bold flex items-center gap-2"><BookOpen className="h-4 w-4 text-[#4C1769]" /> Materials & lecture</h3>
              <p className="text-sm text-zinc-600 mt-1">The lecture of the day and other resources appear here after admin release (eligible attendees only by default).</p>
              <Link href="/materials" className="mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-bold">Browse materials</Link>
            </div>

            <div className="rounded-[24px] bg-white border p-5">
              <h3 className="font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-[#4C1769]" /> Programme</h3>
              <p className="text-sm text-zinc-600">Full timeline and .ics calendar.</p>
              <Link href="/programme" className="mt-3 inline-flex rounded-full bg-[#4C1769] text-white px-4 py-2 text-sm font-bold">View programme</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
