import { PEOPLE } from "@/lib/constants";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";

export default function PeoplePage() {
  return (
    <div className="bg-[#FFFCF8] py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A0B2E]">Distinguished Voices</h1>
          <p className="text-base text-zinc-600 mt-2 max-w-2xl mx-auto">
            Meet the speakers, chairman, hosts, and organisers of the Maiden Registry Discourse.
          </p>
        </div>

        {/* Chief Moji Ladipo — Featured */}
        <div className="mb-10 rounded-[32px] bg-white border border-purple-100 shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-[350px_1fr]">
            <div className="bg-gradient-to-br from-[#4C1769] to-[#6B3A8A] p-8 flex flex-col items-center justify-center text-center">
              <div className="w-40 h-40 rounded-full bg-[#C9B676] text-[#4C1769] grid place-items-center text-5xl font-black shadow-2xl">
                ML
              </div>
              <div className="mt-4 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold tracking-widest px-3 py-1">
                KEYNOTE LECTURER
              </div>
              <p className="text-white/70 text-xs mt-3">Photograph awaiting official approval</p>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-black text-[#1A0B2E] leading-tight">Chief (Mrs.) Mojisola Olusola Ladipo, FNIM, mni</h2>
              <p className="text-sm font-bold text-[#C9B676] mt-1">Lecturer of the Day</p>
              <div className="mt-4 text-sm text-zinc-700 leading-relaxed space-y-3">
                <p>
                  Chief (Mrs.) Mojisola Olusola Ladipo, FNIM, mni, is a distinguished university administrator and the first female Registrar of the University of Ibadan. She served as Registrar for ten years and has contributed extensively to professional university administration, leadership development, training, and mentoring in Nigeria.
                </p>
                <p>
                  She earned a first degree in English and a master's in Industrial and Labour Relations from the University of Ibadan. She helped revive the Committee of Registrars of Nigerian Universities and later served in university administration, consultancy, training, and mentoring roles.
                </p>
                <p>
                  Her lecture will address <b>Governance, Innovation and Service: Changing Higher Education Management</b> — the central theme of this maiden discourse.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-xs font-bold text-[#4C1769]">University of Ibadan</span>
                <span className="rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-xs font-bold text-[#4C1769]">FNIM</span>
                <span className="rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-xs font-bold text-[#4C1769]">mni</span>
              </div>
            </div>
          </div>
        </div>

        {/* Other People */}
        <div className="grid md:grid-cols-2 gap-6">
          {PEOPLE.filter((p) => p.slug !== "mojisola-ladipo").map((p) => (
            <div key={p.slug} className="rounded-[24px] bg-white border border-zinc-100 shadow-sm overflow-hidden">
              <div className="flex">
                {/* Photo placeholder — left side, text wraps around */}
                <div className="w-32 h-32 bg-gradient-to-br from-[#4C1769] to-[#6B3A8A] shrink-0 flex flex-col items-center justify-center text-center p-2">
                  <span className="h-16 w-16 rounded-full bg-[#C9B676] text-[#4C1769] grid place-items-center font-black text-xl">{p.initials}</span>
                  <span className="text-white/60 text-[9px] mt-1">Photo pending</span>
                </div>
                {/* Text wraps around the photo */}
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black text-lg leading-tight text-[#1A0B2E]">{p.name}</h3>
                      <p className="text-sm font-bold text-[#C9B676] mt-1">{p.role}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#C9B676] text-[#4C1769] text-[10px] font-black tracking-widest px-2.5 py-1">{p.badge}</span>
                  </div>
                  <p className="text-sm text-zinc-700 mt-3 leading-relaxed">{p.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Local Organising Committee */}
        <div className="mt-10 rounded-[24px] bg-white border border-purple-100 p-6">
          <h3 className="text-xl font-black text-[#4C1769]">Local Organising Committee</h3>
          <p className="text-sm text-zinc-600 mt-1">Details will be published after official confirmation.</p>
          <div className="mt-4 rounded-2xl bg-purple-50 border border-dashed border-purple-200 p-8 text-center">
            <p className="text-sm font-semibold text-[#4C1769]">LOC members will appear here with their headshots and roles.</p>
            <p className="text-xs text-zinc-600 mt-1">Photos wrapped around text • Department & role displayed</p>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-8 rounded-[24px] bg-[#4C1769] text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-black">Questions about the speakers?</h3>
            <p className="text-sm text-white/80">Contact the Registry Discourse desk.</p>
          </div>
          <div className="flex gap-2">
            <a href="tel:+2347038347947" className="inline-flex items-center gap-2 rounded-full bg-white text-[#4C1769] px-5 py-2.5 text-sm font-bold"><Phone className="h-4 w-4" /> Call</a>
            <a href="https://wa.me/2347038347947?text=Hello%2C%20I%20have%20a%20question%20about%20the%20speakers" target="_blank" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-2.5 text-sm font-bold">WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}
