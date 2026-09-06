"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Download, Search, Users, Filter, ArrowLeft, RefreshCw, CheckCircle2, Clock, Mail, Phone, Building2 } from "lucide-react";

type Registration = {
  id: string;
  first_name: string;
  surname: string;
  email: string;
  phone: string;
  institution: string;
  designation: string | null;
  participation_mode: string;
  status: string;
  access_code: string;
  created_at: string;
  public_activity_opt_in: boolean;
};

export default function AdminRegistrationsPage() {
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "Physical" | "Online">("all");
  const [err, setErr] = useState<string | null>(null);

  async function loadRegistrations() {
    setLoading(true);
    setErr(null);
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { data, error } = await sb.from("registrations")
          .select("*")
          .eq("status", "confirmed")
          .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        setRegs(data || []);
      } else {
        // Local fallback
        const local = JSON.parse(localStorage.getItem("clu_regs") || "[]");
        setRegs(local);
      }
    } catch (e: any) {
      setErr(e.message);
    }
    setLoading(false);
  }

  useEffect(() => { loadRegistrations(); }, []);

  // Filter and search
  const filtered = regs.filter((r) => {
    const matchesSearch = search === "" ||
      r.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.surname?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.institution?.toLowerCase().includes(search.toLowerCase()) ||
      r.access_code?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || r.participation_mode === filter;
    return matchesSearch && matchesFilter;
  });

  // Stats
  const totalPhysical = regs.filter((r) => r.participation_mode === "Physical").length;
  const totalOnline = regs.filter((r) => r.participation_mode === "Online").length;

  // Download CSV
  function downloadCSV() {
    const headers = [
      "S/N", "First Name", "Surname", "Email", "Phone", "Institution",
      "Designation", "Participation", "Status", "Access Code", "Registered"
    ];
    const rows = filtered.map((r, i) => [
      i + 1,
      r.first_name,
      r.surname,
      r.email,
      r.phone,
      r.institution,
      r.designation || "",
      r.participation_mode,
      r.status,
      r.access_code,
      new Date(r.created_at).toLocaleString()
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CLU-Registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Download Excel (simple XML format)
  function downloadExcel() {
    const headers = [
      "S/N", "First Name", "Surname", "Email", "Phone", "Institution",
      "Designation", "Participation", "Status", "Access Code", "Registered"
    ];
    const rows = filtered.map((r, i) => [
      i + 1, r.first_name, r.surname, r.email, r.phone, r.institution,
      r.designation || "", r.participation_mode, r.status, r.access_code,
      new Date(r.created_at).toLocaleString()
    ]);

    let xml = '<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n<Worksheet ss:Name="Registrations">\n<Table>\n';

    // Headers row
    xml += '<Row>\n';
    headers.forEach((h) => { xml += `<Cell><Data ss:Type="String">${h}</Data></Cell>\n`; });
    xml += '</Row>\n';

    // Data rows
    rows.forEach((row) => {
      xml += '<Row>\n';
      row.forEach((cell) => { xml += `<Cell><Data ss:Type="String">${cell}</Data></Cell>\n`; });
      xml += '</Row>\n';
    });

    xml += '</Table>\n</Worksheet>\n</Workbook>';
    const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CLU-Registrations-${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-[#F8F5FF] py-6 min-h-[70vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-[#4C1769] font-bold mb-2">
              <ArrowLeft className="h-4 w-4" /> Back to Admin
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A0B2E]">Registered Participants</h1>
            <p className="text-sm text-zinc-600 mt-1">Logistics planning — {totalPhysical} Physical + {totalOnline} Online = {regs.length} total</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={loadRegistrations} className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-bold">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button onClick={downloadCSV} className="inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-4 py-2 text-sm font-bold">
              <Download className="h-4 w-4" /> Download CSV
            </button>
            <button onClick={downloadExcel} className="inline-flex items-center gap-2 rounded-full bg-[#0E7C3E] text-white px-4 py-2 text-sm font-bold">
              <Download className="h-4 w-4" /> Download Excel
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="rounded-2xl bg-white border border-purple-100 p-4">
            <div className="text-xs font-bold tracking-widest text-[#4C1769]">TOTAL</div>
            <div className="text-2xl font-black text-[#1A0B2E]">{regs.length}</div>
            <div className="text-xs text-zinc-500">All registrations</div>
          </div>
          <div className="rounded-2xl bg-white border border-purple-100 p-4">
            <div className="text-xs font-bold tracking-widest text-[#0E7C3E]">PHYSICAL</div>
            <div className="text-2xl font-black text-[#0E7C3E]">{totalPhysical}</div>
            <div className="text-xs text-zinc-500">In-person attendees</div>
          </div>
          <div className="rounded-2xl bg-white border border-purple-100 p-4">
            <div className="text-xs font-bold tracking-widest text-[#4C1769]">ONLINE</div>
            <div className="text-2xl font-black text-[#4C1769]">{totalOnline}</div>
            <div className="text-xs text-zinc-500">Zoom participants</div>
          </div>
          <div className="rounded-2xl bg-white border border-purple-100 p-4">
            <div className="text-xs font-bold tracking-widest text-[#C9B676]">SHOWING</div>
            <div className="text-2xl font-black text-[#C9B676]">{filtered.length}</div>
            <div className="text-xs text-zinc-500">After filter</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, institution, or access code..."
              className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm bg-white"
            />
          </div>
          <div className="flex gap-2">
            {["all", "Physical", "Online"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  filter === f
                    ? "bg-[#4C1769] text-white"
                    : "bg-white border border-zinc-200 text-zinc-700 hover:bg-purple-50"
                }`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {err && (
          <div className="rounded-2xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-6">{err}</div>
        )}

        {/* Table */}
        {loading ? (
          <div className="rounded-[24px] bg-white border border-purple-100 p-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-[#4C1769] mx-auto" />
            <p className="text-sm text-zinc-600 mt-3">Loading registrations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[24px] bg-white border border-purple-100 p-12 text-center">
            <Users className="h-12 w-12 text-zinc-300 mx-auto" />
            <p className="text-lg font-bold text-zinc-600 mt-3">No registrations found</p>
            <p className="text-sm text-zinc-500 mt-1">{search ? "Try a different search term" : "Registrations will appear here as they come in"}</p>
          </div>
        ) : (
          <div className="rounded-[24px] bg-white border border-purple-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#4C1769] text-white">
                    <th className="px-4 py-3 text-left font-bold">#</th>
                    <th className="px-4 py-3 text-left font-bold">Name</th>
                    <th className="px-4 py-3 text-left font-bold">Email</th>
                    <th className="px-4 py-3 text-left font-bold">Phone</th>
                    <th className="px-4 py-3 text-left font-bold">Institution</th>
                    <th className="px-4 py-3 text-left font-bold">Designation</th>
                    <th className="px-4 py-3 text-left font-bold">Mode</th>
                    <th className="px-4 py-3 text-left font-bold">Access Code</th>
                    <th className="px-4 py-3 text-left font-bold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className={`border-b border-zinc-100 ${i % 2 === 0 ? "bg-white" : "bg-purple-50/30"} hover:bg-purple-50 transition`}>
                      <td className="px-4 py-3 font-bold text-zinc-500">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#1A0B2E]">{r.first_name} {r.surname}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-zinc-600">
                          <Mail className="h-3 w-3" /> {r.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-zinc-600">
                          <Phone className="h-3 w-3" /> {r.phone}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-zinc-600">
                          <Building2 className="h-3 w-3" /> {r.institution}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{r.designation || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          r.participation_mode === "Physical"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {r.participation_mode === "Physical" ? "🏛️ Physical" : "💻 Online"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-[#4C1769] tracking-wider">{r.access_code}</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Download Info */}
        <div className="mt-6 rounded-2xl bg-[#FFFBEB] border border-amber-200 p-4 text-sm text-center">
          <b>Download for logistics:</b> CSV opens in Excel/Google Sheets. Use for seating plans, name tags, and attendance tracking.
        </div>
      </div>
    </div>
  );
}
