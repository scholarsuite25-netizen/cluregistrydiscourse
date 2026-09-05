import Link from "next/link";

export default function AdminPage() {
  const cards = [
    { title: "Registrations", href: "#", desc: "List, search, resend, export CSV/XLSX, audit trail", stat: "— connect Supabase" },
    { title: "QR Scanner / Check-in", href: "#", desc: "Camera scanner + manual code lookup, idempotent", stat: "Camera API ready" },
    { title: "Programme Manager", href: "#", desc: "Create, reorder, publish, archive, ICS/PDF", stat: "10 items seeded" },
    { title: "Materials", href: "#", desc: "Private bucket, signed URLs, eligibility & release", stat: "Private bucket" },
    { title: "People & LOC", href: "#", desc: "Edit lecturer title, photos, LOC CRUD", stat: "0 LOC — correct" },
    { title: "Communications", href: "#", desc: "Announcements, campaigns, consent, idempotency", stat: "Email/Push/WhatsApp adapters" },
    { title: "Attendance Review", href: "#", desc: "Physical & online (attendance word), flag suspicious", stat: "Zero-cost fallback" },
    { title: "Certificates", href: "#", desc: "Template, bulk issue, serial+QR, revoke/reissue", stat: "Verification: /certificate/verify/[serial]" },
  ];
  return (
    <div className="bg-[#F8F5FF] py-8 min-h-[70vh]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-[24px] bg-[#1A0B2E] text-white p-6 flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-xl font-black">Admin Workspace</h1><p className="text-sm text-white/70">Protected — Supabase Auth + roles (super_admin, content_admin, registration_admin, checkin_staff, communications_admin) + RLS + server checks.</p></div>
          <span className="rounded-full bg-amber-400 text-[#1A0B2E] px-3 py-1 text-xs font-black">SUPABASE RLS REQUIRED</span>
        </div>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.title} className="rounded-[24px] bg-white border p-5">
              <h3 className="font-bold">{c.title}</h3>
              <p className="text-xs text-zinc-600 mt-1 min-h-[36px]">{c.desc}</p>
              <div className="mt-3 rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-xs font-semibold text-[#4C1769]">{c.stat}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-white border p-5 text-sm">
          <b>Security:</b> No public <code>select *</code> on registrations. Public activity via safe view/RPC. .env secrets never in source. Every destructive/bulk action needs confirmation dialog with audience counts.
        </div>
        <p className="text-center text-sm mt-4"><Link href="/" className="underline font-bold text-[#4C1769]">Back to site</Link></p>
      </div>
    </div>
  );
}
