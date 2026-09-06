import { PROGRAMME } from "@/lib/constants";
export default function AdminProgramme(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-black">Programme Manager</h1>
      <p className="text-sm text-zinc-600">Admin can create/edit/reorder/publish/archive — display_order + published flag → generates PDF/ICS.</p>
      <div className="mt-4 space-y-2">{PROGRAMME.map((p,i)=><div key={p.title} className="flex gap-3 rounded-xl border p-3 bg-white"><span className="font-mono text-xs bg-[#4C1769] text-white px-2 py-1 rounded-full h-fit">{i+1}</span><div><div className="font-bold text-sm">{p.time} — {p.title}</div><div className="text-xs text-zinc-600">{p.speaker} • {p.venue}</div></div><span className="ml-auto text-xs bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full h-fit">Published</span></div>)}</div>
    </div>
  );
}
