"use client";
import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Plus, Pencil, Trash2, Save, X, RefreshCw, Users, User } from "lucide-react";

type LOCMember = {
  id: string;
  full_name: string;
  department: string;
  committee_role: string;
  display_order: number;
  published: boolean;
};

export default function AdminLOCPage() {
  const [members, setMembers] = useState<LOCMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ full_name: "", department: "", committee_role: "", published: true });
  const [saving, setSaving] = useState(false);

  async function loadMembers() {
    setLoading(true);
    setErr(null);
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { data, error } = await sb.from("organising_committee_members").select("*").order("display_order", { ascending: true });
        if (error) throw new Error(error.message);
        setMembers(data || []);
      }
    } catch (e: any) {
      setErr(e.message);
    }
    setLoading(false);
  }

  useEffect(() => { loadMembers(); }, []);

  async function saveMember() {
    setSaving(true);
    setErr(null);
    try {
      if (!form.full_name) throw new Error("Full name is required");
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const maxOrder = members.length > 0 ? Math.max(...members.map((m) => m.display_order)) + 1 : 0;
        if (editing) {
          const { error } = await sb.from("organising_committee_members").update(form).eq("id", editing);
          if (error) throw new Error(error.message);
        } else {
          const { error } = await sb.from("organising_committee_members").insert([{ ...form, display_order: maxOrder }]);
          if (error) throw new Error(error.message);
        }
        setAdding(false);
        setEditing(null);
        setForm({ full_name: "", department: "", committee_role: "", published: true });
        await loadMembers();
      }
    } catch (e: any) {
      setErr(e.message);
    }
    setSaving(false);
  }

  async function deleteMember(id: string) {
    if (!confirm("Remove this member?")) return;
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { error } = await sb.from("organising_committee_members").delete().eq("id", id);
        if (error) throw new Error(error.message);
        await loadMembers();
      }
    } catch (e: any) {
      setErr(e.message);
    }
  }

  function startEdit(m: LOCMember) {
    setEditing(m.id);
    setAdding(false);
    setForm({ full_name: m.full_name, department: m.department, committee_role: m.committee_role, published: m.published });
  }

  return (
    <div className="py-6 px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A0B2E]">People & Organising Committee</h1>
          <p className="text-sm text-zinc-600 mt-1">Manage committee members shown on the People page.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadMembers} className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-bold"><RefreshCw className="h-4 w-4" /> Refresh</button>
          <button onClick={() => { setAdding(true); setEditing(null); setForm({ full_name: "", department: "", committee_role: "", published: true }); }} className="inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-4 py-2 text-sm font-bold"><Plus className="h-4 w-4" /> Add Member</button>
        </div>
      </div>

      {err && <div className="rounded-2xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-6">{err}</div>}

      {(adding || editing) && (
        <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6 mb-6">
          <h2 className="text-lg font-black text-[#1A0B2E] mb-4">{editing ? "Edit Member" : "Add Committee Member"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-xs font-bold tracking-widest text-zinc-700">FULL NAME *</label><input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" placeholder="e.g., Dr. Adebayo" /></div>
            <div><label className="text-xs font-bold tracking-widest text-zinc-700">DEPARTMENT</label><input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" placeholder="e.g., Computer Science" /></div>
            <div className="sm:col-span-2"><label className="text-xs font-bold tracking-widest text-zinc-700">COMMITTEE ROLE</label><input value={form.committee_role} onChange={(e) => setForm({ ...form, committee_role: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" placeholder="e.g., Chairman" /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={saveMember} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#0E7C3E] text-white px-6 py-2 text-sm font-bold disabled:opacity-50"><Save className="h-4 w-4" /> {saving ? "Saving..." : editing ? "Update" : "Add"}</button>
            <button onClick={() => { setAdding(false); setEditing(null); }} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-6 py-2 text-sm font-bold"><X className="h-4 w-4" /> Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-[24px] bg-white border border-purple-100 p-12 text-center"><RefreshCw className="h-8 w-8 animate-spin text-[#4C1769] mx-auto" /></div>
      ) : members.length === 0 ? (
        <div className="rounded-[24px] bg-white border border-purple-100 p-12 text-center"><Users className="h-12 w-12 text-zinc-300 mx-auto" /><p className="text-lg font-bold text-zinc-600 mt-3">No committee members yet</p><p className="text-sm text-zinc-500 mt-1">Add the first member above.</p></div>
      ) : (
        <div className="rounded-[24px] bg-white border border-purple-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#4C1769] text-white">
              <th className="px-4 py-3 text-left font-bold">#</th>
              <th className="px-4 py-3 text-left font-bold">Name</th>
              <th className="px-4 py-3 text-left font-bold">Department</th>
              <th className="px-4 py-3 text-left font-bold">Role</th>
              <th className="px-4 py-3 text-left font-bold">Actions</th>
            </tr></thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.id} className={`border-b border-zinc-100 ${i % 2 === 0 ? "bg-white" : "bg-purple-50/30"}`}>
                  <td className="px-4 py-3 font-bold text-zinc-500">{i + 1}</td>
                  <td className="px-4 py-3 font-bold text-[#1A0B2E]">{m.full_name}</td>
                  <td className="px-4 py-3 text-zinc-600">{m.department || "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{m.committee_role || "—"}</td>
                  <td className="px-4 py-3 flex gap-1">
                    <button onClick={() => startEdit(m)} className="p-1.5 rounded-lg hover:bg-purple-50 text-[#4C1769]"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => deleteMember(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
