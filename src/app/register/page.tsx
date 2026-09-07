"use client";
import { useState, useEffect, useRef } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { EVENT } from "@/lib/constants";
import { generateAccessCode } from "@/lib/validation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Shield, Copy, Check, Mail } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const codeRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    institution: "",
    designation: "",
    participationMode: "Physical" as "Physical" | "Online",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Auto-redirect countdown
  useEffect(() => {
    if (step !== "success") return;
    if (countdown <= 0) {
      router.push("/portal/dashboard");
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, countdown, router]);

  // Check if already registered — show code immediately
  useEffect(() => {
    const stored = localStorage.getItem("clu_registration");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.access_code) {
          setResult({ ...data, alreadyRegistered: true });
          setStep("success");
        }
      } catch {}
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!form.firstName.trim()) { setErr("Please enter your first name"); return; }
    if (!form.surname.trim()) { setErr("Please enter your surname"); return; }
    if (!form.email.trim()) { setErr("Please enter your email"); return; }
    if (!form.phone.trim()) { setErr("Please enter your phone number"); return; }
    if (!form.institution.trim()) { setErr("Please enter your institution"); return; }

    setLoading(true);
    const accessCode = generateAccessCode(8);

    const payload = {
      first_name: form.firstName.trim(),
      surname: form.surname.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      institution: form.institution.trim(),
      designation: form.designation.trim() || null,
      participation_mode: form.participationMode,
      consent_email: true,
      public_activity_opt_in: true,
      status: "confirmed",
      access_code: accessCode,
    };

    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;

        // Check for duplicate
        const { data: existing } = await sb.from("registrations").select("id").eq("email", payload.email).single();
        if (existing) {
          // Already registered — sign them in and show their code
          const { data: reg } = await sb.from("registrations").select("*").eq("email", payload.email).single();
          // Store persistently in localStorage
          localStorage.setItem("clu_registration", JSON.stringify(reg));
          sessionStorage.setItem("clu_session_code", JSON.stringify(reg));
          setResult({ ...reg, alreadyRegistered: true });
          setStep("success");
          setLoading(false);
          return;
        }

        // New registration
        const { error } = await sb.from("registrations").insert(payload);
        if (error) throw new Error(error.message);

        // Store PERSISTENTLY in localStorage (survives tab close)
        const sessionData = { ...payload, access_code: accessCode, created_at: new Date().toISOString() };
        localStorage.setItem("clu_registration", JSON.stringify(sessionData));
        sessionStorage.setItem("clu_session_code", JSON.stringify(sessionData));
        setResult({ ...sessionData, alreadyRegistered: false });

        // Send access code email (fire and forget)
        fetch("/api/send-access-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: payload.email,
            firstName: payload.first_name,
            surname: payload.surname,
            accessCode: accessCode,
            participationMode: payload.participation_mode,
          }),
        }).then((res) => res.json()).then((data) => {
          if (data.ok) setEmailSent(true);
        }).catch(() => {});
      } else {
        // Local fallback
        const existing: any[] = JSON.parse(localStorage.getItem("clu_regs") || "[]");
        if (existing.some((r) => r.email === payload.email)) {
          const found = existing.find((r) => r.email === payload.email);
          localStorage.setItem("clu_registration", JSON.stringify(found));
          localStorage.setItem("clu_session", JSON.stringify(found));
          setResult({ ...found, alreadyRegistered: true });
          setStep("success");
          setLoading(false);
          return;
        }
        const newReg = { ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() };
        existing.push(newReg);
        localStorage.setItem("clu_regs", JSON.stringify(existing));
        localStorage.setItem("clu_registration", JSON.stringify(newReg));
        localStorage.setItem("clu_session", JSON.stringify(newReg));
        sessionStorage.setItem("clu_session_code", JSON.stringify(newReg));
        setResult({ ...newReg, alreadyRegistered: false });
      }

      setStep("success");
    } catch (e: any) {
      setErr(e.message || "Registration failed. Please try again.");
    }
    setLoading(false);
  }

  function copyCode() {
    const code = result?.access_code || result?.accessCode || "";
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  // SUCCESS STEP
  if (step === "success" && result) {
    const accessCode = result.access_code || result.accessCode;
    return (
      <div className="bg-[#F8F5FF] py-8 min-h-[80vh]">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-[28px] bg-white border border-purple-100 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#0E7C3E] text-white p-6 text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-3" />
              <h1 className="text-2xl sm:text-3xl font-black">
                {result.alreadyRegistered ? "Welcome Back!" : "Registration Successful!"}
              </h1>
              <p className="text-white/80 mt-1">
                {result.alreadyRegistered
                  ? "You already have an account. Here's your access code."
                  : "Your access pass is ready. Save this code now!"}
              </p>
            </div>

            {/* Access Code — BIG AND BOLD */}
            <div ref={codeRef} className="p-6 text-center">
              <div className="text-xs font-bold tracking-[0.2em] text-[#4C1769] mb-2">YOUR ACCESS CODE</div>
              <div className="text-5xl sm:text-6xl font-black tracking-[0.15em] text-[#4C1769] bg-purple-50 rounded-2xl border-2 border-dashed border-[#C9B676] py-6 px-4 select-all relative">
                {accessCode}
                <button
                  onClick={copyCode}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white border border-purple-200 hover:bg-purple-50 transition"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-[#0E7C3E]" />
                  ) : (
                    <Copy className="h-4 w-4 text-[#4C1769]" />
                  )}
                </button>
              </div>

              {copied && (
                <p className="text-sm text-[#0E7C3E] font-bold mt-2">✓ Code copied to clipboard!</p>
              )}

              <p className="text-sm text-zinc-600 mt-3">
                <b>Write this down or take a screenshot.</b><br />
                This code is saved on this device — you can always come back to see it.
              </p>

              {/* Email status */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                {emailSent ? (
                  <span className="inline-flex items-center gap-1 text-[#0E7C3E] font-bold">
                    <Mail className="h-4 w-4" /> Access code sent to {result.email}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-zinc-500">
                    <Mail className="h-4 w-4" /> Code saved on this device
                  </span>
                )}
              </div>
            </div>

            {/* What you can access */}
            <div className="bg-[#FFFBEB] border-t border-amber-100 p-6">
              <h3 className="font-bold text-[#4C1769] mb-3">You now have access to:</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  "Event programme & timeline",
                  "Zoom link (when released)",
                  "Downloadable materials",
                  "Post-event resources",
                  "Certificate (after attendance)",
                  "Personal access pass",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-[#0E7C3E] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-6 space-y-3">
              <button
                onClick={() => router.push("/portal/dashboard")}
                className="w-full rounded-full bg-[#4C1769] text-white py-4 text-lg font-black flex items-center justify-center gap-2"
              >
                Go to My Dashboard <ArrowRight className="h-5 w-5" />
              </button>
              <div className="text-center text-sm text-zinc-500">
                Auto-redirect in {countdown}s... or{" "}
                <button onClick={() => router.push("/portal/dashboard")} className="font-bold text-[#4C1769] underline">
                  click here
                </button>
              </div>
              <Link
                href="/"
                className="block w-full rounded-full border-2 border-[#4C1769] text-[#4C1769] py-3 text-center font-bold"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REGISTRATION FORM
  return (
    <div className="bg-[#F8F5FF] py-8 min-h-[80vh]">
      <div className="mx-auto max-w-xl px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-4 py-2 text-sm font-bold">
            <Shield className="h-4 w-4" /> FREE REGISTRATION
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-[#1A0B2E]">
            Register for the Discourse
          </h1>
          <p className="text-base text-zinc-600 mt-2 max-w-md mx-auto">
            {EVENT.date} • {EVENT.startTime}<br />
            {EVENT.venue}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[28px] bg-white border border-purple-100 shadow-xl p-6 sm:p-8 space-y-5">
          {err && (
            <div className="rounded-2xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm font-semibold">
              {err}
            </div>
          )}

          <div>
            <label className="text-sm font-bold text-[#4C1769]">First Name</label>
            <input
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="Your first name"
              className="mt-1 w-full rounded-xl border-2 border-zinc-200 px-4 py-4 text-lg focus:border-[#4C1769] focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-[#4C1769]">Surname</label>
            <input
              value={form.surname}
              onChange={(e) => update("surname", e.target.value)}
              placeholder="Your surname"
              className="mt-1 w-full rounded-xl border-2 border-zinc-200 px-4 py-4 text-lg focus:border-[#4C1769] focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-[#4C1769]">Email Address</label>
            <input
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@email.com"
              type="email"
              className="mt-1 w-full rounded-xl border-2 border-zinc-200 px-4 py-4 text-lg focus:border-[#4C1769] focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-[#4C1769]">Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+234 703 834 7947"
              type="tel"
              className="mt-1 w-full rounded-xl border-2 border-zinc-200 px-4 py-4 text-lg focus:border-[#4C1769] focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-[#4C1769]">Institution / Organisation</label>
            <input
              value={form.institution}
              onChange={(e) => update("institution", e.target.value)}
              placeholder="e.g., University of Lagos"
              className="mt-1 w-full rounded-xl border-2 border-zinc-200 px-4 py-4 text-lg focus:border-[#4C1769] focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-[#4C1769]">Designation / Rank</label>
            <input
              value={form.designation}
              onChange={(e) => update("designation", e.target.value)}
              placeholder="e.g., Senior Registrar, Professor, etc."
              className="mt-1 w-full rounded-xl border-2 border-zinc-200 px-4 py-4 text-lg focus:border-[#4C1769] focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-[#4C1769]">How will you attend?</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {[
                { value: "Physical", label: "In Person", desc: "At the Auditorium" },
                { value: "Online", label: "Online (Zoom)", desc: "From anywhere" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update("participationMode", opt.value)}
                  className={`rounded-2xl border-2 p-4 text-left transition ${
                    form.participationMode === opt.value
                      ? "border-[#4C1769] bg-purple-50 shadow-md"
                      : "border-zinc-200 bg-white hover:border-purple-200"
                  }`}
                >
                  <div className="text-lg font-bold">{opt.label}</div>
                  <div className="text-sm text-zinc-600">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <label className="flex gap-3 text-sm cursor-pointer">
              <input type="checkbox" required className="mt-1 h-5 w-5 accent-[#4C1769]" />
              <span>
                I agree to receive event emails and understand the <Link href="/privacy" className="underline font-bold text-[#4C1769]">Privacy Policy</Link>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#4C1769] text-white py-5 text-xl font-black flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-900/20"
          >
            {loading ? "Registering…" : "Register Now — It's Free"}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>

          <p className="text-center text-sm text-zinc-500">
            Already registered? <Link href="/portal" className="font-bold text-[#4C1769] underline">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
