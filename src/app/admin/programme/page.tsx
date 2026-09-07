"use client";
import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Plus, Pencil, Trash2, Save, X, RefreshCw, GripVertical, Clock, MapPin, User } from "lucide-react";

type ProgrammeItem = {
  id: string;
  title: string;
  description: string;
  speaker: string;
  venue: string;
  start_time: string;
  end_time: string;
  display_order: number;
  published: boolean;
};

export default function AdminProgrammePage() {
  const [items, setItems] = useState<ProgrammeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", speaker: "", venue: "", start_time: "", end_time: "", published: true });
  const [saving, setSaving] = useState(false);

  async function loadItems() {
    setLoading(true);
    setErr(null);
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { data, error } = await sb.from("programme_items").select("*").order("display_order", { ascending: true });
        if (error) throw new Error(error.message);
        setItems(data || []);
      }
    } catch (e: any) {
      setErr(e.message);
    }
    setLoading(false);
  }

  useEffect(() => { loadItems(); }, []);

  async function saveItem() {
    setSaving(true);
    setErr(null);
    try {
      if (!form.title || !form.start_time) throw new Error("Title and start time are required");
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.display_order)) + 1 : 0;
        if (editing) {
          const { error } = await sb.from("programme_items").update(form).eq("id", editing);
          if (error) throw new Error(error.message);
        } else {
          const { error } = await sb.from("programme_items").insert([{ ...form, display_order: maxOrder }]);
          if (error) throw new Error(error.message);
        }
        setAdding(false);
        setEditing(null);
        setForm({ title: "", description: "", speaker: "", venue: "", start_time: "", end_time: "", published: true });
        await loadItems();
      }
    } catch (e: any) {
      setErr(e.message);
    }
    setSaving(false);
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this programme item?")) return;
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { error } = await sb.from("programme_items").delete().eq("id", id);
        if (error) throw new Error(error.message);
        await loadItems();
      }
    } catch (e: any) {
      setErr(e.message);
    }
  }

  async function togglePublished(id: string, current: boolean) {
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        await sb.from("programme_items").update({ published: !current }).eq("id", id);
        await loadItems();
      }
    } catch (e: any) {
      setErr(e.message);
    }
  }

  function startEdit(item: ProgrammeItem) {
    setEditing(item.id);
    setAdding(false);
    setForm({ title: item.title, description: item.description, speaker: item.speaker, venue: item.venue, start_time: item.start_time, end_time: item.end_time, published: item.published });
  }

  return (
    <div className="py-6 px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A0B2E]">Programme Manager</h1>
          <p className="text-sm text-zinc-600 mt-1">Create, edit, reorder, and publish event programme items.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadItems} className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-bold"><RefreshCw className="h-4 w-4" /> Refresh</button>
          <button onClick={() => { setAdding(true); setEditing(null); setForm({ title: "", description: "", speaker: "", venue: "", start_time: "", end_time: "", published: true }); }} className="inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-4 py-2 text-sm font-bold"><Plus className="h-4 w-4" /> Add Item</button>
        </div>
      </div>

      {err && <div className="rounded-2xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-6">{err}</div>}

      {(adding || editing) && (
        <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6 mb-6">
          <h2 className="text-lg font-black text-[#1A0B2E] mb-4">{editing ? "Edit Item" : "Add Programme Item"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className="text-xs font-bold tracking-widest text-zinc-700">TITLE *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" placeholder="e.g., Opening Ceremony" /></div>
            <div><label className="text-xs font-bold tracking-widest text-zinc-700">SPEAKER</label><input value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" placeholder="e.g., Prof. Johnson" /></div>
            <div><label className="text-xs font-bold tracking-widest text-zinc-700">VENUE</label><input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" placeholder="e.g., Main Auditorium" /></div>
            <div><label className="text-xs font-bold tracking-widest text-zinc-700">START TIME *</label><input value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} type="time" className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" /></div>
            <div><label className="text-xs font-bold tracking-widest text-zinc-700">END TIME</label><input value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} type="time" className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" /></div>
            <div className="sm:col-span-2"><label className="text-xs font-bold tracking-widest text-zinc-700">DESCRIPTION</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" rows={2} /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={saveItem} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#0E7C3E] text-white px-6 py-2 text-sm font-bold disabled:opacity-50"><Save className="h-4 w-4" /> {saving ? "Saving..." : editing ? "Update" : "Add"}</button>
            <button onClick={() => { setAdding(false); setEditing(null); }} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-6 py-2 text-sm font-bold"><X className="h-4 w-4" /> Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-[24px] bg-white border border-purple-100 p-12 text-center"><RefreshCw className="h-8 w-8 animate-spin text-[#4C1769] mx-auto" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-[24px] bg-white border border-purple-100 p-12 text-center"><Clock className="h-12 w-12 text-zinc-300 mx-auto" /><p className="text-lg font-bold text-zinc-600 mt-3">No programme items yet</p></div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="rounded-[20px] bg-white border border-purple-100 p-4 flex items-center gap-4">
              <span className="font-mono text-xs bg-[#4C1769] text-white px-2 py-1 rounded-full shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-[#1A0B2E]">{item.title}</div>
                <div className="text-xs text-zinc-500 flex flex-wrap gap-2 mt-0.5">
                  {item.speaker && <span className="flex items-center gap-1"><User className="h-3 w-3" />{item.speaker}</span>}
                  {item.venue && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.venue}</span>}
                  {item.start_time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.start_time}</span>}
                </div>
              </div>
              <button onClick={() => togglePublished(item.id, item.published)} className={`px-3 py-1 rounded-full text-xs font-bold ${item.published ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                {item.published ? "Published" : "Draft"}
              </button>
              <div className="flex gap-1">
                <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-purple-50 text-[#4C1769]"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
