"use client";
import { useState } from "react";
import Link from "next/link";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Mail, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PortalPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function handleEmail() {
    setErr(null); setMsg(null);
    if (!email) { setErr("Enter your email"); return; }
    if (isSupabaseConfigured) {
      const sb = getSupabase()!;
      const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/portal/dashboard` } });
      if (error) setErr(error.message); else setMsg("Magic link sent — check your email (and spam).");
    } else {
      // local fallback — check storage
      const regs: any[] = JSON.parse(localStorage.getItem("clu_regs") || "[]");
      const found = regs.find((r) => r.email.toLowerCase() === email.toLowerCase());
      if (!found) setErr("No local registration found for this email on this device.");
      else {
        localStorage.setItem("clu_session", JSON.stringify(found));
        setMsg("Local session created. Redirecting to dashboard…");
        setTimeout(() => router.push("/portal/dashboard"), 600);
      }
    }
  }

  async function handleCode() {
    setErr(null); setMsg(null);
    if (!code) { setErr("Enter your access code"); return; }
    if (isSupabaseConfigured) {
      const sb = getSupabase()!;
      const { data, error } = await sb.from("registrations").select("*").eq("access_code", code.trim().toUpperCase()).single();
      if (error || !data) setErr("Access code not found.");
      else {
        sessionStorage.setItem("clu_session_code", JSON.stringify(data));
        router.push("/portal/dashboard");
      }
    } else {
      const regs: any[] = JSON.parse(localStorage.getItem("clu_regs") || "[]");
      const found = regs.find((r) => (r.access_code || r.accessCode) === code.trim().toUpperCase());
      if (!found) setErr("Access code not found locally.");
      else { localStorage.setItem("clu_session", JSON.stringify(found)); router.push("/portal/dashboard"); }
    }
  }

  return (
    <div className="bg-[#F8F5FF] py-10 min-h-[70vh]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Participant Portal</h1>
          <p className="text-sm text-zinc-600 mt-1">Sign in to retrieve your access pass, programme, Zoom link (when released), materials and certificate.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-[24px] bg-white border border-purple-100 shadow-xl p-6">
            <h2 className="font-bold flex items-center gap-2"><Mail className="h-4 w-4 text-[#4C1769]" /> Sign in via email magic link</h2>
            <p className="text-xs text-zinc-600 mt-1">We’ll email you a one-time sign-in link (no password). Recommended.</p>
            <div className="mt-4 flex gap-2">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu.ng" className="flex-1 rounded-xl border border-zinc-200 px-3 py-3 text-sm" />
              <Button onClick={handleEmail}>Send link</Button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">Supabase Auth • OTP/magic link • Row-level security</p>
          </div>
          <div className="rounded-[24px] bg-white border border-purple-100 shadow-xl p-6">
            <h2 className="font-bold flex items-center gap-2"><KeyRound className="h-4 w-4 text-[#4C1769]" /> Retrieve with access code</h2>
            <p className="text-xs text-zinc-600 mt-1">Enter the 8-character code from your confirmation.</p>
            <div className="mt-4 flex gap-2">
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g., AB3D9F2K" className="flex-1 rounded-xl border border-zinc-200 px-3 py-3 text-sm tracking-widest font-mono uppercase" />
              <Button onClick={handleCode} variant="secondary">Retrieve</Button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">Codes are hashed server-side; QR tokens are unguessable and not exposed in URLs.</p>
          </div>
        </div>
        {msg && <div className="mx-auto mt-6 max-w-2xl rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-sm">{msg}</div>}
        {err && <div className="mx-auto mt-6 max-w-2xl rounded-2xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">{err}</div>}
        <p className="text-center text-sm mt-6">New here? <Link href="/register" className="font-bold text-[#4C1769] underline">Register to get your access pass</Link></p>
      </div>
    </div>
  );
}
