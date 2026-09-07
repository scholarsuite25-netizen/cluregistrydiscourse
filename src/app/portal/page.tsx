"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowRight, Mail, CheckCircle2, Copy, Check, LogIn } from "lucide-react";

export default function PortalPage() {
  const [method, setMethod] = useState<"code" | "email">("code");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedUser, setSavedUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // Check if already signed in — auto-redirect to dashboard
  useEffect(() => {
    const stored = localStorage.getItem("clu_registration");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.access_code) {
          setSavedUser(data);
          // Auto-redirect to dashboard after 3 seconds
          const timer = setTimeout(() => {
            sessionStorage.setItem("clu_session_code", JSON.stringify(data));
            router.push("/portal/dashboard");
          }, 3000);
          return () => clearTimeout(timer);
        }
      } catch {}
    }
  }, [router]);

  function copyCode() {
    const code = savedUser?.access_code || "";
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  function goToDashboard() {
    if (savedUser) {
      sessionStorage.setItem("clu_session_code", JSON.stringify(savedUser));
      router.push("/portal/dashboard");
    }
  }

  // Email sign-in — simplest: just type email, auto sign-in
  async function handleEmail() {
    setErr(null); setMsg(null); setLoading(true);
    if (!email.trim()) { setErr("Enter your email"); setLoading(false); return; }

    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured) {
      const sb = getSupabase()!;
      const { data, error } = await sb.from("registrations").select("*").eq("email", cleanEmail).single();
      if (error || !data) {
        setErr("No registration found for this email. Please register first.");
        setLoading(false);
        return;
      }
      // Store persistently — auto sign-in
      localStorage.setItem("clu_registration", JSON.stringify(data));
      sessionStorage.setItem("clu_session_code", JSON.stringify(data));
      setMsg("Signed in! Taking you to your dashboard...");
      setTimeout(() => router.push("/portal/dashboard"), 1000);
    } else {
      const regs: any[] = JSON.parse(localStorage.getItem("clu_regs") || "[]");
      const found = regs.find((r) => r.email.toLowerCase() === cleanEmail);
      if (!found) { setErr("No registration found for this email."); setLoading(false); return; }
      localStorage.setItem("clu_registration", JSON.stringify(found));
      localStorage.setItem("clu_session", JSON.stringify(found));
      sessionStorage.setItem("clu_session_code", JSON.stringify(found));
      setMsg("Signed in! Taking you to your dashboard...");
      setTimeout(() => router.push("/portal/dashboard"), 1000);
    }
    setLoading(false);
  }

  // Access code sign-in
  async function handleCode() {
    setErr(null); setMsg(null); setLoading(true);
    if (!code.trim()) { setErr("Enter your access code"); setLoading(false); return; }

    const cleanCode = code.trim().toUpperCase();

    if (isSupabaseConfigured) {
      const sb = getSupabase()!;
      const { data, error } = await sb.from("registrations").select("*").eq("access_code", cleanCode).single();
      if (error || !data) {
        setErr("Code not found. Check your code and try again.");
        setLoading(false);
        return;
      }
      // Store persistently
      localStorage.setItem("clu_registration", JSON.stringify(data));
      sessionStorage.setItem("clu_session_code", JSON.stringify(data));
      setMsg("Signed in! Taking you to your dashboard...");
      setTimeout(() => router.push("/portal/dashboard"), 1000);
    } else {
      const regs: any[] = JSON.parse(localStorage.getItem("clu_regs") || "[]");
      const found = regs.find((r) => (r.access_code || r.accessCode) === cleanCode);
      if (!found) { setErr("Code not found. Try registering first."); setLoading(false); return; }
      localStorage.setItem("clu_registration", JSON.stringify(found));
      localStorage.setItem("clu_session", JSON.stringify(found));
      sessionStorage.setItem("clu_session_code", JSON.stringify(found));
      setMsg("Signed in! Taking you to your dashboard...");
      setTimeout(() => router.push("/portal/dashboard"), 1000);
    }
    setLoading(false);
  }

  // Already signed in — show saved code with option to go to dashboard
  if (savedUser) {
    return (
      <div className="bg-[#F8F5FF] py-10 min-h-[70vh]">
        <div className="mx-auto max-w-lg px-4">
          <div className="rounded-[24px] bg-[#0E7C3E] text-white p-8 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-3" />
            <h1 className="text-2xl font-black">Welcome Back, {savedUser.first_name}!</h1>
            <p className="text-white/80 mt-1">Taking you to your dashboard...</p>

            <div className="mt-6 bg-white rounded-2xl p-5">
              <div className="text-xs font-bold tracking-[0.2em] text-[#4C1769] mb-1">YOUR ACCESS CODE</div>
              <div className="text-4xl font-black tracking-[0.14em] text-[#4C1769] font-mono select-all relative">
                {savedUser.access_code}
                <button
                  onClick={copyCode}
                  className="absolute -top-1 -right-1 p-1.5 rounded-full bg-purple-50 border border-purple-200 hover:bg-purple-100 transition"
                >
                  {copied ? <Check className="h-3 w-3 text-[#0E7C3E]" /> : <Copy className="h-3 w-3 text-[#4C1769]" />}
                </button>
              </div>
              {copied && <p className="text-xs text-[#0E7C3E] font-bold mt-1">✓ Copied!</p>}
              <p className="text-xs text-zinc-500 mt-2">{savedUser.first_name} {savedUser.surname} • {savedUser.email}</p>
            </div>

            <button
              onClick={goToDashboard}
              className="mt-6 w-full rounded-full bg-white text-[#0E7C3E] py-4 text-lg font-black flex items-center justify-center gap-2"
            >
              Go to My Dashboard Now <ArrowRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => { localStorage.removeItem("clu_registration"); setSavedUser(null); }}
              className="mt-3 w-full rounded-full border-2 border-white/30 text-white py-3 text-sm font-bold"
            >
              Sign out — use a different account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not signed in — show sign-in form
  return (
    <div className="bg-[#F8F5FF] py-10 min-h-[70vh]">
      <div className="mx-auto max-w-lg px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A0B2E]">Sign In</h1>
          <p className="text-base text-zinc-600 mt-2">
            Enter your <b>email</b> (easiest) or <b>access code</b> to sign in.
          </p>
        </div>

        {/* Method toggle */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setMethod("email")}
            className={`rounded-2xl border-2 p-4 text-center transition ${
              method === "email"
                ? "border-[#0E7C3E] bg-emerald-50 shadow-md"
                : "border-zinc-200 bg-white hover:border-purple-200"
            }`}
          >
            <Mail className="h-6 w-6 mx-auto text-[#0E7C3E]" />
            <div className="text-sm font-bold mt-1">Email</div>
            <div className="text-xs text-zinc-500">Easiest — just type email</div>
          </button>
          <button
            onClick={() => setMethod("code")}
            className={`rounded-2xl border-2 p-4 text-center transition ${
              method === "code"
                ? "border-[#4C1769] bg-purple-50 shadow-md"
                : "border-zinc-200 bg-white hover:border-purple-200"
            }`}
          >
            <KeyRound className="h-6 w-6 mx-auto text-[#4C1769]" />
            <div className="text-sm font-bold mt-1">Access Code</div>
            <div className="text-xs text-zinc-500">Type your 8-char code</div>
          </button>
        </div>

        {/* Email Sign-In — DEFAULT, SIMPLEST */}
        {method === "email" && (
          <div className="rounded-[24px] bg-white border-2 border-[#0E7C3E] shadow-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-[#0E7C3E] text-white grid place-items-center">
                <LogIn className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-[#0E7C3E]">Just type your email</h2>
            </div>
            <p className="text-sm text-zinc-600">No password needed. We'll find your registration automatically.</p>
            <div className="mt-4">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                type="email"
                className="w-full rounded-xl border-2 border-zinc-200 px-4 py-5 text-lg focus:border-[#0E7C3E] focus:ring-2 focus:ring-emerald-100"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleEmail(); }}
              />
            </div>
            <button
              onClick={handleEmail}
              disabled={loading}
              className="mt-4 w-full rounded-full bg-[#0E7C3E] text-white py-4 text-lg font-black flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign In with Email"}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
            <p className="text-xs text-zinc-500 mt-3 text-center">
              No account? <Link href="/register" className="underline font-bold text-[#0E7C3E]">Register free</Link>
            </p>
          </div>
        )}

        {/* Access Code Sign-In */}
        {method === "code" && (
          <div className="rounded-[24px] bg-white border border-purple-100 shadow-xl p-6">
            <h2 className="text-lg font-bold text-[#4C1769]">Enter your access code</h2>
            <p className="text-sm text-zinc-600 mt-1">The 8-character code from your registration (like <b>AB3D9F2K</b>).</p>
            <div className="mt-4">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="AB3D9F2K"
                className="w-full rounded-xl border-2 border-zinc-200 px-4 py-5 text-center text-2xl font-mono tracking-[0.2em] uppercase focus:border-[#4C1769]"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleCode(); }}
              />
            </div>
            <button
              onClick={handleCode}
              disabled={loading}
              className="mt-4 w-full rounded-full bg-[#4C1769] text-white py-4 text-lg font-black flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign In with Code"}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
            <p className="text-xs text-zinc-500 mt-3 text-center">
              No code? <Link href="/register" className="underline font-bold text-[#4C1769]">Register free</Link>
            </p>
          </div>
        )}

        {/* Messages */}
        {msg && <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-sm font-semibold">{msg}</div>}
        {err && <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm font-semibold">{err}</div>}

        {/* Register link */}
        <div className="mt-6 text-center">
          <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-[#C9B676] text-[#4C1769] px-6 py-3 text-base font-bold">
            New? Register here — it's free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Admin link */}
        <div className="mt-4 text-center">
          <Link href="/admin" className="text-sm text-zinc-500 hover:text-[#4C1769] underline">
            Admin sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
