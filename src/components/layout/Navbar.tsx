"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, MessageCircle, Sparkles } from "lucide-react";
import { EVENT } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/", label: "Home" },
  { href: "/programme", label: "Programme" },
  { href: "/people", label: "People" },
  { href: "/materials", label: "Materials" },
  { href: "/post-conference", label: "Post-Event" },
  { href: "/portal", label: "Portal" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-purple-100 bg-white/80 backdrop-blur-xl">
      {/* top bar */}
      <div className="hidden md:block bg-[#4C1769] text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
          <span className="flex items-center gap-2"><Sparkles className="h-3 w-3 text-[#C9B676]" /> Maiden Registry Discourse • {EVENT.date} • {EVENT.startTime}</span>
          <span className="flex items-center gap-3">
            <a href={EVENT.phoneHref} className="hover:text-[#C9B676] transition">{EVENT.phone}</a>
            <span className="opacity-30">|</span>
            <a href={`mailto:${EVENT.email}`} className="hover:text-[#C9B676] transition">{EVENT.email}</a>
          </span>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4C1769] to-[#6B3A8A] grid place-items-center text-white font-black text-sm shadow-lg">CLU</div>
            <div className="leading-none">
              <div className="font-black tracking-tight text-[#4C1769] text-[15px]">CLU REGISTRY</div>
              <div className="text-[11px] tracking-[0.2em] font-bold text-[#C9B676] -mt-0.5">DISCOURSE 2026</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="px-4 py-2 rounded-full text-sm font-medium text-zinc-700 hover:text-[#4C1769] hover:bg-purple-50 transition">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <a href={EVENT.phoneHref} className="h-10 w-10 grid place-items-center rounded-full border border-purple-200 text-[#4C1769] hover:bg-purple-50"><Phone className="h-4 w-4" /></a>
            <a href={`${EVENT.whatsappHref}?text=${encodeURIComponent(EVENT.whatsappPrefill)}`} target="_blank" className="h-10 w-10 grid place-items-center rounded-full bg-[#25D366] text-white hover:opacity-90"><MessageCircle className="h-4 w-4" /></a>
            <Link href="/register"><Button size="sm">Register Now</Button></Link>
          </div>

          <button onClick={() => setOpen(!open)} className="lg:hidden h-10 w-10 grid place-items-center rounded-full bg-[#4C1769] text-white">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t bg-white px-4 py-4 space-y-1 shadow-xl">
          {nav.map((n) => (
            <Link key={n.href} onClick={() => setOpen(false)} href={n.href} className="block px-3 py-3 rounded-xl font-medium hover:bg-purple-50 text-[#4C1769]">
              {n.label}
            </Link>
          ))}
          <Link onClick={() => setOpen(false)} href="/register" className="block mt-3"><Button className="w-full">Register — Free Access Pass</Button></Link>
          <div className="flex gap-2 pt-3">
            <a href={EVENT.phoneHref} className="flex-1 flex items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold"><Phone className="h-4 w-4" /> Call</a>
            <a href={`${EVENT.whatsappHref}?text=${encodeURIComponent(EVENT.whatsappPrefill)}`} target="_blank" className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white py-3 text-sm font-semibold"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
          </div>
        </div>
      )}
    </header>
  );
}
