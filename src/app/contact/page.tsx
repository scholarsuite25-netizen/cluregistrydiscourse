import { EVENT } from "@/lib/constants";
export default function ContactPage(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-black">Contact & Support</h1>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <a href={EVENT.phoneHref} className="rounded-2xl bg-[#4C1769] text-white p-6"><div className="text-xs tracking-widest font-bold opacity-70">CALL</div><div className="font-black text-lg">{EVENT.phone}</div></a>
        <a href={`${EVENT.whatsappHref}?text=${encodeURIComponent(EVENT.whatsappPrefill)}`} target="_blank" className="rounded-2xl bg-[#25D366] text-white p-6"><div className="text-xs tracking-widest font-bold opacity-80">WHATSAPP</div><div className="font-black text-lg">Chat instantly</div></a>
      </div>
      <div className="mt-4 rounded-2xl border p-6">
        <div className="text-xs tracking-widest font-bold text-[#4C1769]">EMAIL</div><div className="font-bold">{EVENT.email}</div>
        <p className="text-sm text-zinc-600 mt-2">Venue: {EVENT.venue} • Date: {EVENT.date} • Time: {EVENT.startTime}</p>
      </div>
    </div>
  );
}
