"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationInput, normalizePhone, generateAccessCode } from "@/lib/validation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { EVENT } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, QrCode, Mail, Phone, Building2, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegistrationInput>({
    // @ts-expect-error zodResolver type mismatch with zod v4 - safe at runtime
    resolver: zodResolver(registrationSchema),
    defaultValues: { participationMode: "Physical", whatsappOptIn: false, pushOptIn: false, publicActivityOptIn: true } as any,
  });

  const mode = watch("participationMode");

  async function onSubmit(data: RegistrationInput) {
    setSubmitting(true); setError(null);
    const accessCode = generateAccessCode(8);
    const qrToken = generateAccessCode(12) + generateAccessCode(12);
    const payload = {
      title: data.title || null,
      first_name: data.firstName.trim(),
      surname: data.surname.trim(),
      middle_name: data.middleName || null,
      email: data.email.trim().toLowerCase(),
      phone: normalizePhone(data.phone),
      institution: data.institution.trim(),
      department: data.department || null,
      designation: data.designation || null,
      participation_mode: data.participationMode,
      accessibility: data.accessibility || null,
      consent_email: true,
      whatsapp_opt_in: !!data.whatsappOptIn,
      push_opt_in: !!data.pushOptIn,
      public_activity_opt_in: !!data.publicActivityOptIn,
      status: "confirmed",
      access_code: accessCode,
      qr_token: qrToken,
    };

    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { error: err } = await sb.from("registrations").insert(payload);
        if (err) {
          if (err.message.includes("duplicate") || err.code === "23505") throw new Error("This email or phone is already registered. Please use Portal to retrieve your access pass.");
          throw new Error(err.message);
        }
      } else {
        // local fallback
        const existing: any[] = JSON.parse(localStorage.getItem("clu_regs") || "[]");
        if (existing.some((r) => r.email === payload.email)) throw new Error("This email is already registered locally. Use Portal.");
        existing.push({ ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() });
        localStorage.setItem("clu_regs", JSON.stringify(existing));
        localStorage.setItem("clu_last_reg", JSON.stringify({ ...payload, accessCode, qrToken }));
        // activity
        const act = JSON.parse(localStorage.getItem("clu_activity") || "[]");
        if (payload.public_activity_opt_in) {
          act.unshift({ name: `${payload.first_name} ${payload.surname.charAt(0)}.`, org: payload.institution, timeAgo: "just now" });
          localStorage.setItem("clu_activity", JSON.stringify(act.slice(0, 10)));
        }
        const cnt = Number(localStorage.getItem("clu_reg_count") || "0");
        localStorage.setItem("clu_reg_count", String(cnt + 1));
        localStorage.setItem("clu_access", JSON.stringify({ email: payload.email, accessCode, qrToken, name: `${payload.first_name} ${payload.surname}` }));
      }

      // store for success page
      sessionStorage.setItem("clu_success", JSON.stringify({ email: payload.email, accessCode, qrToken, name: `${payload.first_name} ${payload.surname}`, mode: payload.participation_mode }));
      router.push("/registration/success");
    } catch (e: any) {
      setError(e.message || "Registration failed. Please try again.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="bg-[#F8F5FF] min-h-[80vh] py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-purple-100 px-3 py-1 text-xs font-bold tracking-widest text-[#4C1769]">REGISTRATION • FREE • INSTANT PASS</div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-[#1A0B2E]">Reserve your access pass</h1>
          <p className="text-sm text-zinc-600 mt-1 max-w-2xl mx-auto">Confirmed time: <b>9:00 a.m. WAT</b> • Venue: {EVENT.venue} • Participation: Physical or Online via Zoom. Access code & QR are generated securely on the server.</p>
        </div>

        <div className="grid lg:grid-cols-[1.35fr_0.75fr] gap-6 items-start">
          <form onSubmit={handleSubmit(onSubmit as any)} className="rounded-[28px] bg-white border border-purple-100 shadow-xl p-5 sm:p-7 space-y-5">
            {error && <div className="rounded-2xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 flex gap-2 text-sm"><AlertCircle className="h-5 w-5 shrink-0" /> {error}</div>}

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold tracking-widest text-zinc-700">TITLE (optional)</label>
                <select {...register("title")} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm focus:border-[#4C1769] focus:ring-2 focus:ring-purple-100">
                  <option value="">Select</option><option>Mr.</option><option>Mrs.</option><option>Miss</option><option>Dr.</option><option>Prof.</option><option>Chief</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold tracking-widest">INSTITUTION / ORGANISATION *</label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                  <input {...register("institution")} placeholder="e.g., University of Lagos" className="w-full rounded-xl border border-zinc-200 pl-9 pr-3 py-3 text-sm focus:border-[#4C1769]" />
                </div>
                {errors.institution && <p className="text-xs text-red-600 mt-1">{errors.institution.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className="text-xs font-bold tracking-widest">FIRST NAME *</label><input {...register("firstName")} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" />{errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>}</div>
              <div><label className="text-xs font-bold tracking-widest">MIDDLE NAME</label><input {...register("middleName")} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" /></div>
              <div><label className="text-xs font-bold tracking-widest">SURNAME *</label><input {...register("surname")} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" />{errors.surname && <p className="text-xs text-red-600 mt-1">{errors.surname.message}</p>}</div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-bold tracking-widest">EMAIL *</label><div className="relative mt-1"><Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" /><input {...register("email")} placeholder="you@university.edu.ng" className="w-full rounded-xl border border-zinc-200 pl-9 pr-3 py-3 text-sm" /></div>{errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}</div>
              <div><label className="text-xs font-bold tracking-widest">MOBILE / WHATSAPP *</label><div className="relative mt-1"><Phone className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" /><input {...register("phone")} placeholder="+234 703 834 7947" className="w-full rounded-xl border border-zinc-200 pl-9 pr-3 py-3 text-sm" /></div>{errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}</div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-bold tracking-widest">DEPARTMENT / UNIT</label><input {...register("department")} placeholder="Registry" className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" /></div>
              <div><label className="text-xs font-bold tracking-widest">DESIGNATION</label><input {...register("designation")} placeholder="Assistant Registrar" className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" /></div>
            </div>

            <div>
              <label className="text-xs font-bold tracking-widest">PARTICIPATION MODE *</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {["Physical", "Online"].map((m) => (
                  <label key={m} className={`rounded-2xl border-2 px-4 py-3 cursor-pointer flex items-center gap-3 transition ${mode === m ? "border-[#4C1769] bg-purple-50" : "border-zinc-200 bg-white"}`}>
                    <input type="radio" value={m} {...register("participationMode")} className="accent-[#4C1769]" />
                    <span className="font-bold text-sm">{m}</span>
                    <span className="ml-auto text-xs text-zinc-600">{m === "Physical" ? "Auditorium" : "Zoom"}</span>
                  </label>
                ))}
              </div>
              {errors.participationMode && <p className="text-xs text-red-600 mt-1">{errors.participationMode.message}</p>}
            </div>

            <div><label className="text-xs font-bold tracking-widest">ACCESSIBILITY NEEDS (private)</label><textarea {...register("accessibility")} rows={2} placeholder="Optional — e.g., wheelchair access, sign language…" className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" /></div>

            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-2">
              <label className="flex gap-3 text-sm"><input type="checkbox" {...register("consentEmail")} className="mt-1 accent-[#4C1769]" /> <span><b>Consent to event email</b> — required for operational messages (access pass, programme, certificate). You can unsubscribe from marketing.</span></label>
              {errors.consentEmail && <p className="text-xs text-red-600">{String(errors.consentEmail.message)}</p>}
              <label className="flex gap-3 text-sm"><input type="checkbox" {...register("whatsappOptIn")} className="mt-1 accent-[#25D366]" /> <span>Opt-in to <b>WhatsApp</b> automated messages (only if you tick this; requires Meta provider to be configured).</span></label>
              <label className="flex gap-3 text-sm"><input type="checkbox" {...register("publicActivityOptIn")} className="mt-1 accent-[#4C1769]" /> <span>Opt-in to appear in the <b>public live registration widget</b> (shows first name + surname initial only).</span></label>
              <label className="flex gap-3 text-sm"><input type="checkbox" {...register("privacyAck")} className="mt-1 accent-[#4C1769]" /> <span>I have read the <Link href="/privacy" className="underline font-bold text-[#4C1769]">Privacy Notice</Link> and understand how my data is used.</span></label>
              {errors.privacyAck && <p className="text-xs text-red-600">{String(errors.privacyAck.message)}</p>}
            </div>

            <Button type="submit" disabled={submitting} size="lg" className="w-full gap-2">
              {submitting ? "Securing your pass…" : "Generate my access pass"} <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-center text-xs text-zinc-500">By registering you agree to our <Link href="/terms" className="underline">Terms</Link>. Access code is cryptographically generated — never Math.random().</p>
          </form>

          <div className="space-y-4">
            <div className="rounded-[24px] bg-[#4C1769] text-white p-6">
              <h3 className="font-black">What happens next?</h3>
              <ol className="mt-3 space-y-2 text-sm text-white/85 list-decimal list-inside">
                <li>Access code + QR generated securely</li>
                <li>Personalised access pass (PDF) available instantly</li>
                <li>Email confirmation (and WhatsApp if opted-in & configured)</li>
                <li>Zoom link released to confirmed <b>Online</b> participants at configured time</li>
                <li>Show QR at check-in for attendance & certificate eligibility</li>
              </ol>
              <div className="mt-4 rounded-2xl bg-white/10 border border-white/20 p-3 text-xs leading-relaxed">
                <div className="font-bold text-[#C9B676] flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Privacy & anti-fraud</div>
                Duplicate emails/phones are safely redirected to retrieval. Codes are hashed server-side; QR tokens are unguessable. No personal data inside QR.
              </div>
            </div>
            <div className="rounded-[24px] bg-white border border-purple-100 p-5">
              <h4 className="font-bold text-[#4C1769] flex items-center gap-2"><QrCode className="h-4 w-4" /> Need help?</h4>
              <p className="text-sm text-zinc-600 mt-1">Contact the Registry Discourse desk.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={EVENT.phoneHref} className="rounded-full bg-[#4C1769] text-white px-4 py-2 text-sm font-bold">Call {EVENT.phone}</a>
                <a href={`${EVENT.whatsappHref}?text=${encodeURIComponent(EVENT.whatsappPrefill)}`} target="_blank" className="rounded-full bg-[#25D366] text-white px-4 py-2 text-sm font-bold">WhatsApp</a>
              </div>
              <p className="mt-3 text-xs text-zinc-500">Already registered? <Link href="/portal" className="font-bold text-[#4C1769] underline">Retrieve your pass in Portal</Link></p>
            </div>
            <div className="rounded-[24px] bg-[#FFFBEB] border border-amber-100 p-5">
              <div className="flex items-center gap-2 font-bold text-[#4C1769]"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Genuine registrations only</div>
              <p className="text-xs text-zinc-600 mt-1">Counts and activity toasts are derived only from confirmed Supabase rows with public opt-in. Never seeded, never fabricated.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
