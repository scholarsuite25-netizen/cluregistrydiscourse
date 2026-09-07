"use client";
import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Award, RefreshCw, CheckCircle2, XCircle, Search } from "lucide-react";

export default function AdminCertsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, eligible: 0 });

  async function loadData() {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { data } = await sb.from("registrations").select("id, first_name, surname, email, institution, access_code, checked_in, status").eq("status", "confirmed");
        if (data) {
          const checkedIn = data.filter((r) => r.checked_in);
          setRegistrations(data);
          setStats({ total: data.length, checkedIn: checkedIn.length, eligible: checkedIn.length });
        }
      }
    } catch {}
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const filtered = registrations.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.first_name?.toLowerCase().includes(q) || r.surname?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q) || r.access_code?.toLowerCase().includes(q);
  });

  return (
    <div className="py-6 px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A0B2E]">Certificates</h1>
          <p className="text-sm text-zinc-600 mt-1">View certificate eligibility. Checked-in participants are eligible for certificates.</p>
        </div>
        <button onClick={loadData} className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-bold"><RefreshCw className="h-4 w-4" /> Refresh</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-2xl bg-white border border-purple-100 p-4 text-center">
          <div className="text-2xl font-black text-[#1A0B2E]">{stats.total}</div>
          <div className="text-xs font-bold text-zinc-500">REGISTERED</div>
        </div>
        <div className="rounded-2xl bg-white border border-purple-100 p-4 text-center">
          <div className="text-2xl font-black text-[#0E7C3E]">{stats.checkedIn}</div>
          <div className="text-xs font-bold text-zinc-500">CHECKED IN</div>
        </div>
        <div className="rounded-2xl bg-white border border-purple-100 p-4 text-center">
          <div className="text-2xl font-black text-[#C9B676]">{stats.eligible}</div>
          <div className="text-xs font-bold text-zinc-500">CERT ELIGIBLE</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or access code..." className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm bg-white" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-[24px] bg-white border border-purple-100 p-12 text-center"><RefreshCw className="h-8 w-8 animate-spin text-[#4C1769] mx-auto" /></div>
      ) : (
        <div className="rounded-[24px] bg-white border border-purple-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#4C1769] text-white">
                <th className="px-4 py-3 text-left font-bold">Name</th>
                <th className="px-4 py-3 text-left font-bold">Email</th>
                <th className="px-4 py-3 text-left font-bold">Institution</th>
                <th className="px-4 py-3 text-left font-bold">Access Code</th>
                <th className="px-4 py-3 text-left font-bold">Checked In</th>
                <th className="px-4 py-3 text-left font-bold">Certificate</th>
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} className={`border-b border-zinc-100 ${i % 2 === 0 ? "bg-white" : "bg-purple-50/30"}`}>
                    <td className="px-4 py-3 font-bold text-[#1A0B2E]">{r.first_name} {r.surname}</td>
                    <td className="px-4 py-3 text-zinc-600">{r.email}</td>
                    <td className="px-4 py-3 text-zinc-600">{r.institution}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#4C1769]">{r.access_code}</td>
                    <td className="px-4 py-3">
                      {r.checked_in ? <CheckCircle2 className="h-4 w-4 text-[#0E7C3E]" /> : <XCircle className="h-4 w-4 text-zinc-300" />}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${r.checked_in ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                        {r.checked_in ? "Eligible" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
