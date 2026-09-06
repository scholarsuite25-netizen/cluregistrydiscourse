"use client";
import { useState } from "react";
import Link from "next/link";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    if (!email || !password) { setErr("Enter email and password"); setLoading(false); return; }
    if (isSupabaseConfigured) {
      const sb = getSupabase()!;
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) { setErr(error.message); setLoading(false); return; }
      const { data: adminRole } = await sb.from("admin_users").select("role").eq("id", data.user.id).single();
      if (!adminRole) { setErr("This account is not an admin. Use the participant portal."); setLoading(false); return; }
      sessionStorage.setItem("clu_admin_role", adminRole.role);
      sessionStorage.setItem("clu_admin_id", data.user.id);
      setSignedIn(true);
    } else {
      setErr("Supabase not configured — admin requires live database.");
    }
    setLoading(false);
  }

  if (!signedIn) {
    return (
      <div className="bg-[#F8F5FF] py-10 min-h-[70vh]">
        <div className="mx-auto max-w-md px-4">
          <div className="rounded-[24px] bg-[#1A0B2E] text-white p-6 text-center mb-6">
            <h1 className="text-xl font-black">Admin Sign In</h1>
            <p className="text-sm text-white/70 mt-1">Sign in with your admin email and password.</p>
          </div>
          <form onSubmit={handleLogin} className="rounded-[24px] bg-white border border-purple-100 shadow-xl p-6 space-y-4">
            {err && <div className="rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">{err}</div>}
            <div>
              <label className="text-xs font-bold tracking-widest text-zinc-700">EMAIL</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="scholarsuite25@gmail.com" className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold tracking-widest text-zinc-700">PASSWORD</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Your password" className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-full bg-[#4C1769] text-white py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50">
              <LogIn className="h-4 w-4" /> {loading ? "Signing in…" : "Sign In"}
            </button>
            <p className="text-xs text-zinc-500 text-center">Admins only. Participants use <Link href="/portal" className="underline font-bold text-[#4C1769]">/portal</Link>.</p>
          </form>
          <p className="text-center text-sm mt-4"><Link href="/" className="underline font-bold text-[#4C1769]">Back to site</Link></p>
        </div>
      </div>
    );
  }

  const cards = [
    { title: "View All Registrations", href: "/admin/registrations", desc: "Full table with search, filter, CSV/Excel download for logistics planning", stat: "Download CSV/Excel" },
    { title: "QR Scanner / Check-in", href: "/admin/checkin", desc: "Camera scanner + manual code lookup, idempotent", stat: "Camera API ready" },
    { title: "Programme Manager", href: "/admin/programme", desc: "Create, reorder, publish, archive, ICS/PDF", stat: "10 items seeded" },
    { title: "Materials", href: "/admin/materials", desc: "Upload and release materials to participants", stat: "All registered" },
    { title: "People & LOC", href: "/admin/loc", desc: "Edit lecturer title, photos, LOC CRUD", stat: "0 LOC — correct" },
    { title: "Manage Hotels", href: "/admin/hotels", desc: "Add, edit, remove hotels shown on Visitors Guide page", stat: "Dynamic from DB" },
    { title: "Communications", href: "/admin", desc: "Announcements, campaigns, consent, idempotency", stat: "Email/Push/WhatsApp adapters" },
    { title: "Certificates", href: "/admin/certificates", desc: "Template, bulk issue, serial+QR, revoke/reissue", stat: "Verification: /certificate/verify/[serial]" },
  ];

  return (
    <div className="bg-[#F8F5FF] py-8 min-h-[70vh]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-[24px] bg-[#1A0B2E] text-white p-6 flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-xl font-black">Admin Workspace</h1><p className="text-sm text-white/70">Signed in as <b>{email}</b> • Supabase Auth + RLS + role-based access.</p></div>
          <span className="rounded-full bg-emerald-400 text-[#1A0B2E] px-3 py-1 text-xs font-black">SIGNED IN</span>
        </div>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <Link key={c.title} href={c.href} className="rounded-[24px] bg-white border p-5 hover:shadow-lg hover:border-purple-200 transition block">
              <h3 className="font-bold">{c.title}</h3>
              <p className="text-xs text-zinc-600 mt-1 min-h-[36px]">{c.desc}</p>
              <div className="mt-3 rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-xs font-semibold text-[#4C1769]">{c.stat}</div>
            </Link>
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
