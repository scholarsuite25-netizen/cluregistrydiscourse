import Link from "next/link";
import Image from "next/image";
import { EVENT, PEOPLE, PROGRAMME, STATS } from "@/lib/constants";
import { Countdown } from "@/components/home/Countdown";
import { ActivityWidget } from "@/components/home/ActivityWidget";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ShieldCheck, QrCode, Award, BookOpen, Zap, ArrowRight, Clock, Sparkles, Play } from "lucide-react";

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative bg-[#4C1769] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4C1769] via-[#5A1E7D] to-[#3A1150]" />
          <div className="absolute -top-24 -right-24 h-[520px] w-[520px] rounded-full bg-[#C9B676]/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[560px] w-[560px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">
          {/* top pill */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white text-[#4C1769] px-3 py-1.5 text-xs font-black tracking-widest">MAIDEN EDITION • 2026</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#C9B676] text-[#4C1769] px-3 py-1.5 text-xs font-bold">{EVENT.type}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white px-3 py-1.5 text-xs font-semibold">Physical & Online via Zoom</span>
          </div>

          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-10 items-start">
            <div>
              <h1 className="font-black leading-[0.95] tracking-tight">
                <span className="block text-white text-3xl sm:text-4xl lg:text-5xl">CLU REGISTRY</span>
                <span className="block text-[#C9B676] text-3xl sm:text-4xl lg:text-5xl">DISCOURSE</span>
              </h1>
              <p className="mt-3 text-lg sm:text-xl font-semibold text-white leading-snug max-w-2xl">
                {EVENT.fullTitle}
              </p>

              {/* Guest Lecturer */}
              <div className="mt-4 rounded-2xl bg-white/10 border border-white/20 p-4 max-w-2xl">
                <div className="text-xs font-bold tracking-widest text-[#C9B676]">GUEST LECTURER</div>
                <div className="text-lg font-black text-white mt-1">Chief (Mrs.) Mojisola Olusola Ladipo, FNIM, mni</div>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">
                  Distinguished university administrator and the first female Registrar of the University of Ibadan. She served as Registrar for ten years and has contributed extensively to professional university administration, leadership development, training, and mentoring in Nigeria. She earned a first degree in English and a master's in Industrial and Labour Relations from the University of Ibadan and helped revive the Committee of Registrars of Nigerian Universities.
                </p>
              </div>
              <p className="mt-3 text-sm sm:text-[15px] text-white/80 max-w-xl leading-relaxed">
                A historic gathering of registrars, administrators and scholars to reimagine governance, ignite innovation and elevate service in Nigerian higher education.
              </p>

              {/* key facts card */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
                <div className="rounded-2xl bg-white p-4 flex gap-3 items-center">
                  <span className="h-10 w-10 rounded-xl bg-[#4C1769] text-white grid place-items-center"><Calendar className="h-5 w-5" /></span>
                  <div>
                    <div className="text-xs font-bold tracking-widest text-[#4C1769]">DATE</div>
                    <div className="text-sm font-bold leading-tight">{EVENT.date}</div>
                    <div className="text-xs text-zinc-600">{EVENT.startTime}</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4 flex gap-3 items-center">
                  <span className="h-10 w-10 rounded-xl bg-[#C9B676] text-[#4C1769] grid place-items-center"><MapPin className="h-5 w-5" /></span>
                  <div>
                    <div className="text-xs font-bold tracking-widest text-[#4C1769]">VENUE</div>
                    <div className="text-sm font-bold leading-tight">University Auditorium</div>
                    <div className="text-xs text-zinc-600">Chrisland University, Abeokuta</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4 flex gap-3 items-center">
                  <span className="h-10 w-10 rounded-xl bg-[#0E7C3E] text-white grid place-items-center"><Users className="h-5 w-5" /></span>
                  <div>
                    <div className="text-xs font-bold tracking-widest text-[#4C1769]">ACCESS</div>
                    <div className="text-sm font-bold leading-tight">Physical + Zoom</div>
                    <div className="text-xs text-zinc-600">Online via secure link</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/register"><Button size="lg" variant="secondary" className="gap-2">Register & Get Access Pass <ArrowRight className="h-4 w-4" /></Button></Link>
                <Link href="/programme" className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white px-6 py-3 font-semibold hover:bg-white/10 transition"><Play className="h-4 w-4" /> View Programme</Link>
              </div>
              <p className="mt-3 text-xs text-white/60">Free registration • Instant access pass with QR • Secure verification</p>
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] bg-white/5 border border-white/10 backdrop-blur p-4 sm:p-5">
                <div className="flex items-center gap-2 text-[#C9B676] font-bold tracking-widest text-xs mb-3"><Clock className="h-4 w-4" /> COUNTDOWN TO DISCOURSE</div>
                <Countdown />
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl bg-white p-3">
                    <div className="font-bold text-[#4C1769]">Physical arrival</div>
                    <div className="text-zinc-600">08:00 WAT • Auditorium Foyer</div>
                  </div>
                  <div className="rounded-2xl bg-[#C9B676] p-3">
                    <div className="font-bold text-[#4C1769]">Zoom opens</div>
                    <div className="text-[#4C1769]/80">09:00 WAT • Verified online</div>
                  </div>
                </div>
              </div>
              <ActivityWidget />
            </div>
          </div>

          {/* stats */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur px-5 py-4 text-white">
                <div className="text-2xl font-black">{s.value}</div>
                <div className="text-xs font-bold tracking-widest opacity-80">{s.label}</div>
                <div className="text-xs opacity-60">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-[#FFFBEB] border-y border-amber-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-center gap-6 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold text-[#4C1769]"><ShieldCheck className="h-4 w-4 text-[#0E7C3E]" /> Verified identities</span>
          <span className="inline-flex items-center gap-2 font-semibold text-[#4C1769]"><QrCode className="h-4 w-4 text-[#4C1769]" /> QR access pass</span>
          <span className="inline-flex items-center gap-2 font-semibold text-[#4C1769]"><Award className="h-4 w-4 text-[#C9B676]" /> Attendance certificates</span>
          <span className="inline-flex items-center gap-2 font-semibold text-[#4C1769]"><Zap className="h-4 w-4 text-[#B25900]" /> PWA — works offline</span>
          <span className="inline-flex items-center gap-2 font-semibold text-[#4C1769]"><BookOpen className="h-4 w-4 text-[#6B3A8A]" /> Protected materials</span>
        </div>
      </section>

      {/* PEOPLE PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-xs font-bold tracking-widest text-[#4C1769]"><Sparkles className="h-3 w-3" /> DISTINGUISHED VOICES</div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-[#1A0B2E]">Meet the discourse leaders</h2>
            <p className="text-sm text-zinc-600 max-w-2xl mt-1">Distinguished academics and administrators shaping the future of higher education management.</p>
          </div>
          <Link href="/people" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-5 py-2.5 text-sm font-semibold">View all people <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {PEOPLE.map((p) => (
            <Link key={p.slug} href="/people" className="group rounded-[24px] bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-[#4C1769] to-[#6B3A8A] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-full bg-[#C9B676] text-[#4C1769] text-[10px] font-black tracking-widest px-2.5 py-1">{p.badge}</span>
                  {p.photo && (
                    <Image src={p.photo} alt={p.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover border-2 border-white/80 shadow-lg" />
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold leading-tight text-[#1A0B2E] line-clamp-2 text-sm">{p.name}</h3>
                <p className="text-xs font-semibold text-[#C9B676] mt-1 line-clamp-2">{p.role}</p>
                <p className="text-xs text-zinc-600 mt-2 line-clamp-2 leading-relaxed">{p.excerpt}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#4C1769] group-hover:gap-2 transition-all">View profile <ArrowRight className="h-3 w-3" /></span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link href="/people" className="inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-5 py-2.5 text-sm font-semibold">View all people <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      {/* PROGRAMME SNAPSHOT */}
      <section className="bg-[#F8F5FF] border-y border-purple-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A0B2E]">Programme at a glance</h2>
              <p className="text-sm text-zinc-600 mt-2">From arrival to closing — every moment designed for insight, connection and service.</p>
              <div className="mt-6 space-y-3">
                {PROGRAMME.slice(0, 5).map((it) => (
                  <div key={it.time} className="flex gap-3 rounded-2xl bg-white border border-purple-50 p-4 shadow-sm">
                    <div className="shrink-0 rounded-xl bg-[#4C1769] text-white px-3 py-2 text-center min-w-[92px]">
                      <div className="text-xs font-bold tracking-widest">{it.time.split(" ")[0]}</div>
                      <div className="text-[11px] opacity-80">{it.time.split(" ").slice(1).join(" ")}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm leading-tight">{it.title}</div>
                      <div className="text-xs font-semibold text-[#C9B676]">{it.speaker}</div>
                      <div className="text-xs text-zinc-600 line-clamp-1">{it.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/programme" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border border-purple-200 px-5 py-2.5 text-sm font-bold text-[#4C1769] hover:bg-purple-50">Full programme & ICS calendar <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="rounded-[28px] bg-[#4C1769] text-white p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#C9B676]/20 blur-2xl" />
              <h3 className="text-xl font-black">Why this discourse matters</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/85">
                <li className="flex gap-3"><span className="h-6 w-6 rounded-full bg-white text-[#4C1769] grid place-items-center text-xs font-black shrink-0">1</span> Registry as strategic governance — beyond administration.</li>
                <li className="flex gap-3"><span className="h-6 w-6 rounded-full bg-white text-[#4C1769] grid place-items-center text-xs font-black shrink-0">2</span> Innovation under constraints: low-cost, high-impact digital practice.</li>
                <li className="flex gap-3"><span className="h-6 w-6 rounded-full bg-white text-[#4C1769] grid place-items-center text-xs font-black shrink-0">3</span> Service excellence that restores trust across the university.</li>
              </ul>
              <div className="mt-6 rounded-2xl bg-white p-4 text-[#1A0B2E]">
                <div className="text-xs font-bold tracking-widest text-[#4C1769]">SECURE YOUR SEAT</div>
                <div className="text-sm font-bold mt-1">Instant QR access pass • Add to calendar • Join link for online</div>
                <Link href="/register" className="mt-3 inline-flex w-full justify-center rounded-full bg-[#4C1769] text-white py-3 text-sm font-bold">Register in 60 seconds</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-[32px] bg-gradient-to-br from-[#4C1769] via-[#5A1E7D] to-[#B25900] p-[1px]">
          <div className="rounded-[31px] bg-white p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#1A0B2E]">Ready to be part of history?</h3>
              <p className="text-sm text-zinc-600 mt-1">Join 500+ leaders on 15 October 2026 — Physical or Online. Your access pass is generated instantly.</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href="/register"><Button size="lg" className="gap-2">Register now <ArrowRight className="h-4 w-4" /></Button></Link>
              <a href={`${EVENT.whatsappHref}?text=${encodeURIComponent(EVENT.whatsappPrefill)}`} target="_blank" className="inline-flex items-center gap-2 rounded-full border-2 border-[#25D366] text-[#0E7C3E] px-6 py-3 font-bold">Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
