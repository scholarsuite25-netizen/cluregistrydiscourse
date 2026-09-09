import Link from "next/link";
import Image from "next/image";
import { EVENT } from "@/lib/constants";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A0B2E] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/images/clu-logo-white.png" alt="Chrisland University logo" width={40} height={40} className="h-10 w-10 rounded-xl object-contain bg-white" />
              <div>
                <div className="font-black leading-none">CLU REGISTRY DISCOURSE</div>
                <div className="text-xs tracking-widest text-[#C9B676]">GOVERNANCE • INNOVATION • SERVICE</div>
              </div>
            </div>
            <p className="text-sm text-white/70 max-w-md leading-relaxed">
              Maiden Registry Discourse of Chrisland University, Abeokuta. A historic gathering of registrars, administrators and scholars shaping the future of higher-education management in Nigeria.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={EVENT.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-white text-[#4C1769] px-4 py-2 text-sm font-semibold"><Phone className="h-4 w-4" /> {EVENT.phone}</a>
              <a href={`${EVENT.whatsappHref}?text=${encodeURIComponent(EVENT.whatsappPrefill)}`} target="_blank" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-2 text-sm font-semibold"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[#C9B676] mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li><Link href="/programme" className="hover:text-white">Programme</Link></li>
              <li><Link href="/people" className="hover:text-white">People & LOC</Link></li>
              <li><Link href="/materials" className="hover:text-white">Materials</Link></li>
              <li><Link href="/visitors-guide" className="hover:text-white">Visitors Guide</Link></li>
              <li><Link href="/post-conference" className="hover:text-white">Post-Event</Link></li>
              <li><Link href="/portal" className="hover:text-white">Participant Portal</Link></li>
              <li><Link href="/register" className="hover:text-white">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#C9B676] mb-3">Contact & Legal</h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li className="flex gap-2"><MapPin className="h-4 w-4 text-[#C9B676] mt-0.5" /> {EVENT.venue}</li>
              <li className="flex gap-2"><Mail className="h-4 w-4 text-[#C9B676]" /> {EVENT.email}</li>
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link> • <Link href="/terms" className="hover:text-white">Terms</Link> • <Link href="/accessibility" className="hover:text-white">Accessibility</Link></li>
              <li><Link href="/certificates" className="hover:text-white">Certificates</Link> • <Link href="/contact" className="hover:text-white">Contact & Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60">
          <span>© 2026 Chrisland University, Abeokuta. Registry Discourse. All rights reserved.</span>
          <span className="text-[#C9B676] font-semibold flex flex-wrap items-center gap-2">
            Designed and powered by{" "}
            <a href="tel:+2348034710699" className="text-white underline decoration-[#C9B676]/50 underline-offset-2 hover:text-[#C9B676] transition">S. B. Omotoso</a>
            <span className="flex items-center gap-1">
              <a href="tel:+2348034710699" className="inline-flex items-center gap-1 rounded-full border border-[#C9B676]/40 text-[#C9B676] px-2.5 py-1 hover:bg-[#C9B676] hover:text-[#1A0B2E] transition"><Phone className="h-3 w-3" /> Call</a>
              <a href={`https://wa.me/2348034710699?text=${encodeURIComponent("Hello, I am contacting you regarding the CLU Registry Discourse.")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-[#25D366] text-white px-2.5 py-1 hover:opacity-90 transition"><MessageCircle className="h-3 w-3" /> WhatsApp</a>
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
