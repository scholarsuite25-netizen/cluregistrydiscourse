import { PEOPLE } from "@/lib/constants";

export default function PeoplePage() {
  return (
    <div className="bg-[#FFFCF8] py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">People</h1>
        <p className="text-sm text-zinc-600 mt-1">All profiles require organiser approval before publication. No qualifications or photographs are fabricated.</p>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {PEOPLE.map((p) => (
            <div key={p.slug} className="rounded-[24px] bg-white border border-zinc-100 shadow-sm overflow-hidden">
              <div className="h-44 bg-gradient-to-br from-[#4C1769] to-[#6B3A8A] relative">
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <span className="rounded-full bg-[#C9B676] text-[#4C1769] text-xs font-black tracking-widest px-3 py-1">{p.badge}</span>
                  <span className="h-14 w-14 rounded-2xl bg-white grid place-items-center font-black text-[#4C1769] text-lg shadow">{p.initials}</span>
                </div>
                <span className="absolute top-3 left-3 rounded-full bg-white/15 border border-white/20 text-white text-[10px] font-bold tracking-widest px-2.5 py-1">OFFICIAL PHOTOGRAPH AWAITING APPROVAL</span>
              </div>
              <div className="p-6">
                <h2 className="font-black text-lg leading-tight">{p.name}</h2>
                <p className="text-sm font-bold text-[#C9B676] mt-1">{p.role}</p>
                <p className="text-sm text-zinc-700 mt-3 leading-relaxed">{p.bio}</p>
                <p className="text-xs text-zinc-500 mt-3">Neutral branded silhouette is used until an authorised photograph is supplied. Images are never hotlinked and alt text is provided.</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[24px] bg-white border border-purple-100 p-6">
          <h3 className="font-black text-[#4C1769]">Local Organising Committee</h3>
          <p className="text-sm text-zinc-600 mt-1">Local Organising Committee details will be published after official confirmation.</p>
          <div className="mt-4 rounded-2xl bg-purple-50 border border-dashed border-purple-200 p-8 text-center">
            <p className="text-sm font-semibold text-[#4C1769]">Zero LOC records seeded — production starts empty as required.</p>
            <p className="text-xs text-zinc-600 mt-1">Admins can add full name, department/unit, role, display order, photo (optional) and publish status without code changes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
