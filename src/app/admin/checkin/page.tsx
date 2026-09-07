"use client";
import { useEffect, useRef, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Search, CheckCircle2, XCircle, RefreshCw, Camera, Keyboard, Users } from "lucide-react";

type Registration = {
  id: string;
  first_name: string;
  surname: string;
  email: string;
  phone: string;
  institution: string;
  participation_mode: string;
  status: string;
  access_code: string;
  checked_in: boolean;
  checked_in_at: string | null;
};

export default function CheckinPage() {
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<"scan" | "manual">("manual");
  const [result, setResult] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [recentCheckins, setRecentCheckins] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, remaining: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent check-ins and stats
  async function loadStats() {
    if (!isSupabaseConfigured) return;
    const sb = getSupabase()!;
        const { data: all } = await sb.from("registrations").select("id, checked_in, checked_in_at, first_name, surname, email, phone, institution, participation_mode, status, access_code").eq("status", "confirmed");
    if (all) {
      const checkedIn = all.filter((r) => r.checked_in);
      setStats({ total: all.length, checkedIn: checkedIn.length, remaining: all.length - checkedIn.length });
      setRecentCheckins(checkedIn.sort((a, b) => (b.checked_in_at || "").localeCompare(a.checked_in_at || "")).slice(0, 20));
    }
  }

  useEffect(() => { loadStats(); }, []);

  // Camera scanner
  useEffect(() => {
    if (mode !== "scan") return;
    let stream: MediaStream | null = null;
    async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      } catch {}
    }
    init();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [mode]);

  async function handleCheckin(e: React.FormEvent) {
    e.preventDefault();
    const accessCode = code.trim().toUpperCase();
    if (!accessCode) return;
    setLoading(true);
    setResult(null);

    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { data: reg, error } = await sb.from("registrations").select("*").eq("access_code", accessCode).single();

        if (error || !reg) {
          setResult({ type: "error", message: `No registration found for code: ${accessCode}` });
          setLoading(false);
          return;
        }

        if (reg.checked_in) {
          setResult({ type: "info", message: `${reg.first_name} ${reg.surname} already checked in at ${new Date(reg.checked_in_at).toLocaleString()}` });
          setLoading(false);
          return;
        }

        const now = new Date().toISOString();
        const { error: updateError } = await sb.from("registrations").update({ checked_in: true, checked_in_at: now }).eq("id", reg.id);

        if (updateError) {
          setResult({ type: "error", message: "Failed to record check-in: " + updateError.message });
          setLoading(false);
          return;
        }

        setResult({ type: "success", message: `Checked in: ${reg.first_name} ${reg.surname} (${reg.institution}) at ${new Date(now).toLocaleString()}` });
      } else {
        // Local fallback
        const regs: any[] = JSON.parse(localStorage.getItem("clu_regs") || "[]");
        const found = regs.find((r) => r.access_code === accessCode);
        if (!found) { setResult({ type: "error", message: `Not found: ${accessCode}` }); setLoading(false); return; }
        const key = `clu_checkin_${found.id}`;
        if (localStorage.getItem(key)) {
          setResult({ type: "info", message: `Already checked in at ${localStorage.getItem(key)}` });
          setLoading(false);
          return;
        }
        const now = new Date().toISOString();
        localStorage.setItem(key, now);
        setResult({ type: "success", message: `Checked in: ${found.first_name} ${found.surname}` });
      }

      setCode("");
      await loadStats();
    } catch (e: any) {
      setResult({ type: "error", message: e.message });
    }
    setLoading(false);
    inputRef.current?.focus();
  }

  return (
    <div className="py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A0B2E]">Check-in Desk</h1>
        <p className="text-sm text-zinc-600 mt-1">Scan QR code or enter access code manually. Idempotent — duplicate scans show original time.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-2xl bg-white border border-purple-100 p-4 text-center">
          <div className="text-2xl font-black text-[#1A0B2E]">{stats.total}</div>
          <div className="text-xs font-bold text-zinc-500">EXPECTED</div>
        </div>
        <div className="rounded-2xl bg-white border border-purple-100 p-4 text-center">
          <div className="text-2xl font-black text-[#0E7C3E]">{stats.checkedIn}</div>
          <div className="text-xs font-bold text-zinc-500">CHECKED IN</div>
        </div>
        <div className="rounded-2xl bg-white border border-purple-100 p-4 text-center">
          <div className="text-2xl font-black text-[#B25900]">{stats.remaining}</div>
          <div className="text-xs font-bold text-zinc-500">REMAINING</div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode("manual")} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${mode === "manual" ? "bg-[#4C1769] text-white" : "bg-white border border-zinc-200 text-zinc-700"}`}>
          <Keyboard className="h-4 w-4" /> Manual Entry
        </button>
        <button onClick={() => setMode("scan")} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${mode === "scan" ? "bg-[#4C1769] text-white" : "bg-white border border-zinc-200 text-zinc-700"}`}>
          <Camera className="h-4 w-4" /> QR Scanner
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Scanner / Manual Input */}
        <div className="rounded-[24px] bg-white border border-purple-100 overflow-hidden">
          {mode === "scan" ? (
            <div className="relative aspect-[4/3] bg-black">
              <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
              <div className="absolute inset-0 border-[3px] border-[#C9B676]/60 m-8 rounded-2xl pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 text-center text-xs text-white/80">Align QR code within the frame</div>
            </div>
          ) : (
            <div className="p-6">
              <form onSubmit={handleCheckin} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AB3D9F2K"
                  className="flex-1 rounded-xl border border-zinc-200 px-4 py-4 font-mono tracking-widest uppercase text-lg text-center font-bold"
                  autoFocus
                />
                <button type="submit" disabled={loading || !code} className="rounded-full bg-[#4C1769] text-white px-6 py-4 text-sm font-bold disabled:opacity-50 flex items-center gap-2">
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Check In
                </button>
              </form>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`mx-4 mb-4 rounded-xl p-4 text-sm font-semibold ${
              result.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" :
              result.type === "error" ? "bg-red-50 border border-red-200 text-red-800" :
              "bg-blue-50 border border-blue-200 text-blue-800"
            }`}>
              {result.message}
            </div>
          )}
        </div>

        {/* Recent Check-ins */}
        <div className="rounded-[24px] bg-white border border-purple-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#1A0B2E]">RECENT CHECK-INS</h3>
            <button onClick={loadStats} className="p-1.5 rounded-lg hover:bg-purple-50 text-[#4C1769]">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-auto">
            {recentCheckins.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-8 w-8 text-zinc-300 mx-auto" />
                <p className="text-xs text-zinc-500 mt-2">No check-ins yet</p>
              </div>
            ) : (
              recentCheckins.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg bg-purple-50/50">
                  <CheckCircle2 className="h-4 w-4 text-[#0E7C3E] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-[#1A0B2E] truncate">{r.first_name} {r.surname}</div>
                    <div className="text-xs text-zinc-500">{r.institution}</div>
                  </div>
                  <div className="text-xs text-zinc-400 shrink-0">
                    {r.checked_in_at ? new Date(r.checked_in_at).toLocaleTimeString() : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
