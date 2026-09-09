"use client";
import Link from "next/link";
import { MapPin, Navigation, Hotel, Clock, Star, Phone, ExternalLink, ArrowRight, Car, Train, Plane, Globe } from "lucide-react";
import { EVENT } from "@/lib/constants";
import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

const DIRECTIONS = [
  {
    from: "Lagos",
    via: "Lagos–Ibadan Expressway → Sagamu Interchange → Abeokuta Expressway",
    steps: [
      "Enter Lagos–Ibadan Expressway from Lagos Island / Mainland",
      "Drive straight on the expressway (toll gates may apply)",
      "At Sagamu Interchange, turn right onto Abeokuta–Sagamu Expressway",
      "Continue towards Abeokuta on the expressway",
      "Turn to NNPC Filling Station on your right towards Abiola Way",
      "At Iyana Mortuary Area, turn right to Idi Aba Road, along FMC",
      "Pass Federal Medical Centre (FMC) on your right",
      "Continue straight — Chrisland University is on your left",
      "Estimated time: 1.5 – 2 hours from Lagos Island"
    ],
    tip: "Most popular and fastest route. Well-paved dual carriageway."
  },
  {
    from: "Ibadan",
    via: "Lagos–Ibadan Expressway → Sagamu Interchange → Abeokuta Expressway",
    steps: [
      "Enter Lagos–Ibadan Expressway from Ibadan (Mokola / UI area)",
      "Drive towards Lagos on the expressway",
      "At Sagamu Interchange, turn right onto Abeokuta–Sagamu Expressway",
      "Continue towards Abeokuta on the expressway",
      "Turn to NNPC Filling Station on your right towards Abiola Way",
      "At Iyana Mortuary Area, turn right to Idi Aba Road, along FMC",
      "Pass Federal Medical Centre (FMC) on your right",
      "Continue straight — Chrisland University is on your left",
      "Estimated time: 1 – 1.5 hours from Ibadan city centre"
    ],
    tip: "RECOMMENDED ROUTE. Fastest and most reliable."
  },
  {
    from: "Ibadan (Old Road)",
    via: "Ibadan–Abeokuta Old Road (NOT RECOMMENDED)",
    steps: [
      "This route goes through Odeda / Ogunmakin area",
      "Road is currently in VERY BAD condition",
      "Heavy potholes and construction delays",
      "Estimated time: 2.5 – 3+ hours (unpredictable)",
      "NOT ADVISED — use the Expressway route instead"
    ],
    tip: "⚠️ NOT RECOMMENDED. Road is very bad. Use the Expressway route."
  }
];

const PLACES_TO_VISIT = [
  {
    name: "Olumo Rock",
    desc: "Ancient rock formation and historical landmark of Abeokuta. Panoramic views of the city, caves used during inter-tribal wars, and a cable car ride to the summit.",
    time: "30 min drive from university",
    best: "Early morning or sunset",
    fee: "₦4,000.00 / person"
  },
  {
    name: "Obasanjo Presidential Library",
    desc: "A world-class library and cultural centre housing books, photographs, and memorabilia from Nigeria's history. Includes a museum, children's playground, and conferencing facilities.",
    time: "20 min drive from university",
    best: "Weekday mornings",
    fee: "From ₦2,500 / person"
  },
  {
    name: "Itoku Adire Market",
    desc: "Famous market for traditional Adire (tie-dye) fabrics unique to Abeokuta. Buy authentic hand-dyed fabrics, clothing, and souvenirs directly from local artisans.",
    time: "25 min drive from university",
    best: "Morning (less crowded)",
    fee: "Free entry (shopping varies)"
  }
];

const EVENT_DATE = "October 15, 2026";
const DAY_BEFORE = "October 14, 2026";
const DAY_AFTER = "October 16, 2026";

export default function VisitorsGuidePage() {
  return (
    <div className="bg-[#FFFCF8] py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A0B2E]">Visitors Guide</h1>
          <p className="text-base text-zinc-600 mt-2 max-w-2xl mx-auto">
            Everything you need for {EVENT.date} — directions, hotels, and places to visit.
          </p>
        </div>

        {/* ==================== MAP SECTION ==================== */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-[#1A0B2E] mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-[#4C1769]" /> University Location
          </h2>
          <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg overflow-hidden">
            {/* Google Map Embed */}
            <div className="w-full h-[400px] bg-zinc-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.1234567890123!2d3.456789!3d7.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDcnMjQuNCJOIDPCzDI3JzI0LjQiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Chrisland University Location"
              />
            </div>
            <div className="p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                  <div className="text-xs font-bold tracking-widest text-[#4C1769]">VENUE</div>
                  <div className="text-lg font-black text-[#1A0B2E] mt-1">{EVENT.venue}</div>
                  <div className="text-sm text-zinc-600 mt-1">{EVENT.date} • {EVENT.startTime}</div>
                </div>
                <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                  <div className="text-xs font-bold tracking-widest text-[#4C1769]">COORDINATES</div>
                  <div className="text-lg font-black text-[#1A0B2E] mt-1">7.1234°N, 3.4568°E</div>
                  <div className="text-sm text-zinc-600 mt-1">Abeokuta, Ogun State, Nigeria</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== DIRECTIONS ==================== */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-[#1A0B2E] mb-4 flex items-center gap-2">
            <Navigation className="h-6 w-6 text-[#0E7C3E]" /> How to Get Here
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {DIRECTIONS.map((dir, i) => (
              <div key={i} className={`rounded-[24px] bg-white border shadow-lg overflow-hidden ${
                dir.from.includes("Old Road") ? "border-red-200" : "border-purple-100"
              }`}>
                <div className={`px-6 py-3 ${
                  dir.from.includes("Old Road")
                    ? "bg-red-600 text-white"
                    : dir.from === "Lagos"
                    ? "bg-[#4C1769] text-white"
                    : "bg-[#0E7C3E] text-white"
                }`}>
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    <span className="font-black text-sm tracking-widest">FROM {dir.from.toUpperCase()}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold text-[#C9B676] tracking-widest mb-2">VIA</div>
                  <p className="text-sm font-bold text-[#1A0B2E] mb-3">{dir.via}</p>
                  <ol className="space-y-2 text-sm text-zinc-700">
                    {dir.steps.map((step, j) => (
                      <li key={j} className="flex gap-3">
                        <span className="shrink-0 h-6 w-6 rounded-full bg-[#4C1769] text-white text-xs font-bold grid place-items-center">{j + 1}</span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <div className={`mt-4 rounded-xl p-3 text-sm font-bold ${
                    dir.from.includes("Old Road")
                      ? "bg-red-50 border border-red-200 text-red-700"
                      : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  }`}>
                    {dir.from.includes("Old Road") ? "⚠️" : "✅"} {dir.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== PLACES TO VISIT ==================== */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-[#1A0B2E] mb-2 flex items-center gap-2">
            <Star className="h-6 w-6 text-[#C9B676]" /> Places to Visit
          </h2>
          <p className="text-sm text-zinc-600 mb-6">For participants arriving early or staying after the programme.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLACES_TO_VISIT.map((place, i) => (
              <div key={i} className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6 hover:shadow-xl transition">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#4C1769] to-[#6B3A8A] grid place-items-center text-[#C9B676] mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-[#1A0B2E]">{place.name}</h3>
                <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{place.desc}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-zinc-700">
                    <MapPin className="h-4 w-4 text-[#4C1769]" />
                    <span>{place.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700">
                    <Clock className="h-4 w-4 text-[#C9B676]" />
                    <span>Best: {place.best}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700">
                    <span className="font-bold text-[#0E7C3E]">Fee:</span>
                    <span className="font-bold">{place.fee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== HOTELS ==================== */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-[#1A0B2E] mb-2 flex items-center gap-2">
            <Hotel className="h-6 w-6 text-[#B25900]" /> Hotels & Accommodation
          </h2>
          <p className="text-sm text-zinc-600 mb-6">Contact hotels directly to book. Rates are per night and may vary.</p>

          {/* Featured Hotels */}
          <div className="mb-8">
            <h3 className="text-lg font-black text-[#4C1769] mb-2 flex items-center gap-2">
              <Star className="h-5 w-5 text-[#C9B676]" /> Recommended Hotels
            </h3>
            <p className="text-sm text-zinc-600 mb-4">Rooms reserved for the Maiden Registry Discourse. Contact hotels directly to book. Rates are per night.</p>
            <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#4C1769] text-white">
                      <th className="px-4 py-3 text-left font-bold">Hotel</th>
                      <th className="px-4 py-3 text-left font-bold">Location</th>
                      <th className="px-4 py-3 text-left font-bold">Rooms & Rates</th>
                      <th className="px-4 py-3 text-left font-bold">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Academy Suites */}
                    <tr className="border-b border-zinc-100 bg-white">
                      <td className="px-4 py-4 font-bold text-[#1A0B2E]">Academy Suites</td>
                      <td className="px-4 py-4 text-zinc-600 whitespace-normal">Beside Abadiyyah Central Mosque, M.K.O Abiola Way, Leme, Abeokuta</td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex justify-between gap-6 text-zinc-700"><span>Super Deluxe (12 rooms)</span><span className="font-bold text-[#0E7C3E]">₦35,000</span></div>
                          <div className="flex justify-between gap-6 text-zinc-700"><span>Super Royal (10 rooms)</span><span className="font-bold text-[#0E7C3E]">₦40,000</span></div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <a href="tel:+2348176666601" className="inline-flex items-center gap-1 text-[#4C1769] font-bold hover:underline">
                          <Phone className="h-3 w-3" /> 0817 666 6601
                        </a>
                      </td>
                    </tr>
                    {/* Grand Style Hotel */}
                    <tr className="border-b border-zinc-100 bg-purple-50/30">
                      <td className="px-4 py-4 font-bold text-[#1A0B2E]">Grand Style Hotel</td>
                      <td className="px-4 py-4 text-zinc-600 whitespace-normal">No 6, Lisabi Grammar School, Idi-Aba, Abeokuta</td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex justify-between gap-6 text-zinc-700"><span>Deluxe Room (6 rooms)</span><span className="font-bold text-[#0E7C3E]">₦30,000</span></div>
                          <div className="flex justify-between gap-6 text-zinc-700"><span>Grand Royal (15 rooms)</span><span className="font-bold text-[#0E7C3E]">₦35,000</span></div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <a href="tel:+2349135935259" className="inline-flex items-center gap-1 text-[#4C1769] font-bold hover:underline">
                          <Phone className="h-3 w-3" /> 0913 593 5259
                        </a>
                      </td>
                    </tr>
                    {/* Abeokuta International Hotel */}
                    <tr className="border-b border-zinc-100 bg-white">
                      <td className="px-4 py-4 font-bold text-[#1A0B2E]">Abeokuta International Hotel</td>
                      <td className="px-4 py-4 text-zinc-600 whitespace-normal">32, Elite Road, Idi-Aba, Abeokuta</td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex justify-between gap-6 text-zinc-700"><span>Mini Deluxe (12 rooms)</span><span className="font-bold text-[#0E7C3E]">₦25,000</span></div>
                          <div className="flex justify-between gap-6 text-zinc-700"><span>Standard Deluxe (11 rooms)</span><span className="font-bold text-[#0E7C3E]">₦30,000</span></div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <a href="tel:+2348167148838" className="inline-flex items-center gap-1 text-[#4C1769] font-bold hover:underline">
                            <Phone className="h-3 w-3" /> 0816 714 8838
                          </a>
                          <a href="tel:+2348079500964" className="inline-flex items-center gap-1 text-[#4C1769] font-bold hover:underline">
                            <Phone className="h-3 w-3" /> 0807 950 0964
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Additional Hotels — from Admin */}
          <AdditionalHotels />
        </section>

        {/* ==================== QUICK TIPS ==================== */}
        <section className="mb-12">
          <div className="rounded-[24px] bg-[#4C1769] text-white p-6">
            <h3 className="font-black text-lg mb-4">Quick Tips for Visitors</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="shrink-0 h-6 w-6 rounded-full bg-[#C9B676] text-[#4C1769] text-xs font-bold grid place-items-center">1</span>
                  <span><b>Book hotels early</b> — rooms fill up fast around event day.</span>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 h-6 w-6 rounded-full bg-[#C9B676] text-[#4C1769] text-xs font-bold grid place-items-center">2</span>
                  <span><b>Use the Expressway</b> — the old road from Ibadan is bad.</span>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 h-6 w-6 rounded-full bg-[#C9B676] text-[#4C1769] text-xs font-bold grid place-items-center">3</span>
                  <span><b>Bring your access code</b> — screenshot or write it down.</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="shrink-0 h-6 w-6 rounded-full bg-[#C9B676] text-[#4C1769] text-xs font-bold grid place-items-center">4</span>
                  <span><b>Arrive by 8:00 AM</b> — registration starts at 8:00 AM.</span>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 h-6 w-6 rounded-full bg-[#C9B676] text-[#4C1769] text-xs font-bold grid place-items-center">5</span>
                  <span><b>Cash & card</b> — bring both for local purchases.</span>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 h-6 w-6 rounded-full bg-[#C9B676] text-[#4C1769] text-xs font-bold grid place-items-center">6</span>
                  <span><b>Weather</b> — October is rainy. Bring an umbrella.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-8 py-3 text-sm font-bold">
            Back to Home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

type AdditionalHotel = {
  id: string;
  name: string;
  location: string;
  rate: string;
  phone: string;
  rating: number;
  note: string;
};

function AdditionalHotels() {
  const [hotels, setHotels] = useState<AdditionalHotel[]>([]);

  useEffect(() => {
    async function load() {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { data } = await sb.from("hotels")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setHotels(data);
      }
    }
    load();
  }, []);

  if (hotels.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-black text-[#4C1769] mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5" /> More Hotels in Abeokuta
      </h3>
      <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#4C1769] text-white">
                <th className="px-4 py-3 text-left font-bold">Hotel</th>
                <th className="px-4 py-3 text-left font-bold">Location</th>
                <th className="px-4 py-3 text-left font-bold">Rate/Night</th>
                <th className="px-4 py-3 text-left font-bold">Phone</th>
                <th className="px-4 py-3 text-left font-bold">Rating</th>
                <th className="px-4 py-3 text-left font-bold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((h, i) => (
                <tr key={h.id} className={`border-b border-zinc-100 ${i % 2 === 0 ? "bg-white" : "bg-purple-50/30"}`}>
                  <td className="px-4 py-3 font-bold text-[#1A0B2E]">{h.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{h.location}</td>
                  <td className="px-4 py-3 font-bold text-[#0E7C3E]">{h.rate}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${h.phone}`} className="inline-flex items-center gap-1 text-[#4C1769] font-bold hover:underline">
                      <Phone className="h-3 w-3" /> {h.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`h-3 w-3 ${j < h.rating ? "text-[#C9B676] fill-[#C9B676]" : "text-zinc-300"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600">{h.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
