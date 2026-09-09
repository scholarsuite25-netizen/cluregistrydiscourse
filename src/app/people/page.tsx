import { PEOPLE } from "@/lib/constants";
import Link from "next/link";
import { ArrowRight, Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const LOC_MEMBERS = [
  { name: "Mr. Olubunmi Omomogbe", role: "Chairman / Logistics", phone: "07038347947" },
  { name: "Engr. Ajibade", role: "Member / Logistics", phone: "08057070965" },
  { name: "Mr. Rapheal Decampos", role: "Member / Logistics / Protocols", phone: "08023364530" },
  { name: "Mrs. Dolapo Akintoye", role: "Member / Logistics / Protocols", phone: "07039736973" },
  { name: "Mr. Tobi Olaleye", role: "Member / Media", phone: "08167741656" },
  { name: "Mr. Boluwatife Jeremiah", role: "Member / Logistics / Registration", phone: "08101339945" },
  { name: "Mr. Friday John", role: "Member / Media", phone: "07061368977" },
  { name: "Mrs. Tolulope Ilugbo", role: "Member / Registration / Welfare", phone: "08064952854" },
  { name: "Mrs. Abosede Olaniyi", role: "Member / Publicity / Registration / Welfare", phone: "09051566682" },
  { name: "Mr. Victor Idigbe", role: "Member / Registration / Protocols / Welfare", phone: "08103821387" },
  { name: "Miss Esther Okafor", role: "Member / Welfare", phone: "07041389211" },
  { name: "Mrs. Mercy Jonah", role: "Member / Welfare", phone: "08064619722" },
  { name: "Mrs. Loveth Okonkwo", role: "Secretary / Welfare", phone: "07032690847" },
];

function waLink(phone: string) {
  // Nigerian format 07038347947 -> wa.me/2347038347947
  const intl = "+234" + phone.slice(1);
  return `https://wa.me/${intl.replace("+", "")}?text=${encodeURIComponent("Hello, I'm contacting you regarding the CLU Registry Discourse.")}`;
}

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

        {/* All People — Equal Focus */}
        <div className="grid md:grid-cols-2 gap-6">
          {PEOPLE.map((p) => (
            <div key={p.slug} className="rounded-[24px] bg-white border border-purple-100 shadow-lg overflow-hidden">
              <div className="flex">
                {/* Photo placeholder — left side, text wraps around */}
                <div className="w-36 h-36 bg-gradient-to-br from-[#4C1769] to-[#6B3A8A] shrink-0 flex flex-col items-center justify-center text-center p-2">
                  <span className="h-20 w-20 rounded-full bg-[#C9B676] text-[#4C1769] grid place-items-center font-black text-2xl shadow-lg">{p.initials}</span>
                  <span className="text-white/70 text-[10px] mt-2 font-bold">{p.badge}</span>
                </div>
                {/* Text wraps around the photo */}
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-black text-lg leading-tight text-[#1A0B2E]">{p.name}</h3>
                      <p className="text-sm font-bold text-[#C9B676] mt-1">{p.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed">{p.bio}</p>
                  <Link href="/people" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#4C1769] hover:gap-2 transition-all">
                    Full profile <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Local Organising Committee */}
        <div className="mt-10 rounded-[24px] bg-white border border-purple-100 p-6">
          <h3 className="text-xl font-black text-[#4C1769]">Local Organising Committee</h3>
          <p className="text-sm text-zinc-600 mt-1">The team behind the Maiden Registry Discourse. Tap to call or message any member.</p>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LOC_MEMBERS.map((m) => {
              const initials = m.name.replace(/^(Mr\.|Mrs\.|Miss|Engr\.|Dr\.|Prof\.)\s*/, "").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
              return (
                <div key={m.name} className="rounded-[20px] border border-purple-100 bg-[#FBF7FF] p-4 flex items-start gap-3">
                  <span className="h-11 w-11 rounded-full bg-[#4C1769] text-white grid place-items-center font-black text-sm shrink-0">{initials}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[#1A0B2E] text-sm leading-tight">{m.name}</div>
                    <div className="text-xs text-[#C9B676] font-bold mt-0.5">{m.role}</div>
                    <div className="flex gap-2 mt-2">
                      <a href={`tel:+234${m.phone.slice(1)}`} className="inline-flex items-center gap-1 rounded-full bg-[#4C1769] text-white px-3 py-1.5 text-xs font-bold hover:bg-[#3A1150]">
                        <Phone className="h-3 w-3" /> Call
                      </a>
                      <a href={waLink(m.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-[#25D366] text-white px-3 py-1.5 text-xs font-bold hover:opacity-90">
                        <MessageCircle className="h-3 w-3" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
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
