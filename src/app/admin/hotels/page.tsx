"use client";
import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Plus, Pencil, Trash2, Save, X, Star, Phone, MapPin, RefreshCw } from "lucide-react";

type Hotel = {
  id: string;
  name: string;
  location: string;
  rate: string;
  phone: string;
  rating: number;
  note: string;
  created_at: string;
};

const EMPTY_HOTEL: Omit<Hotel, "id" | "created_at"> = {
  name: "",
  location: "",
  rate: "",
  phone: "",
  rating: 3,
  note: "",
};

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_HOTEL);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadHotels() {
    setLoading(true);
    setErr(null);
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { data, error } = await sb.from("hotels")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        setHotels(data || []);
      } else {
        const local = JSON.parse(localStorage.getItem("clu_hotels") || "[]");
        setHotels(local);
      }
    } catch (e: any) {
      setErr(e.message);
    }
    setLoading(false);
  }

  useEffect(() => { loadHotels(); }, []);

  async function saveHotel() {
    setSaving(true);
    setErr(null);
    try {
      if (!form.name || !form.location || !form.rate || !form.phone) {
        throw new Error("Name, location, rate, and phone are required");
      }

      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        if (editing) {
          const { error } = await sb.from("hotels").update(form).eq("id", editing);
          if (error) throw new Error(error.message);
        } else {
          const { error } = await sb.from("hotels").insert([form]);
          if (error) throw new Error(error.message);
        }
      } else {
        const local = JSON.parse(localStorage.getItem("clu_hotels") || "[]");
        if (editing) {
          const idx = local.findIndex((h: Hotel) => h.id === editing);
          if (idx >= 0) local[idx] = { ...local[idx], ...form };
        } else {
          local.unshift({ ...form, id: Date.now().toString(), created_at: new Date().toISOString() });
        }
        localStorage.setItem("clu_hotels", JSON.stringify(local));
      }

      setAdding(false);
      setEditing(null);
      setForm(EMPTY_HOTEL);
      await loadHotels();
    } catch (e: any) {
      setErr(e.message);
    }
    setSaving(false);
  }

  async function deleteHotel(id: string) {
    if (!confirm("Delete this hotel?")) return;
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { error } = await sb.from("hotels").delete().eq("id", id);
        if (error) throw new Error(error.message);
      } else {
        const local = JSON.parse(localStorage.getItem("clu_hotels") || "[]");
        localStorage.setItem("clu_hotels", JSON.stringify(local.filter((h: Hotel) => h.id !== id)));
      }
      await loadHotels();
    } catch (e: any) {
      setErr(e.message);
    }
  }

  function startEdit(h: Hotel) {
    setEditing(h.id);
    setAdding(false);
    setForm({ name: h.name, location: h.location, rate: h.rate, phone: h.phone, rating: h.rating, note: h.note });
  }

  function startAdd() {
    setAdding(true);
    setEditing(null);
    setForm(EMPTY_HOTEL);
  }

  function cancel() {
    setAdding(false);
    setEditing(null);
    setForm(EMPTY_HOTEL);
  }

  return (
    <div className="bg-[#F8F5FF] py-6 min-h-[70vh]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A0B2E]">Manage Hotels</h1>
            <p className="text-sm text-zinc-600 mt-1">Add, edit, or remove hotels shown on the Visitors Guide page.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadHotels} className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-bold">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button onClick={startAdd} className="inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-4 py-2 text-sm font-bold">
              <Plus className="h-4 w-4" /> Add Hotel
            </button>
          </div>
        </div>

        {/* Error */}
        {err && (
          <div className="rounded-2xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-6">{err}</div>
        )}

        {/* Add/Edit Form */}
        {(adding || editing) && (
          <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6 mb-6">
            <h2 className="text-lg font-black text-[#1A0B2E] mb-4">
              {editing ? "Edit Hotel" : "Add New Hotel"}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold tracking-widest text-zinc-700">HOTEL NAME *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Conference Hotel"
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest text-zinc-700">LOCATION *</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g., Abeokuta City Centre"
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest text-zinc-700">RATE PER NIGHT *</label>
                <input
                  value={form.rate}
                  onChange={(e) => setForm({ ...form, rate: e.target.value })}
                  placeholder="e.g., ₦25,000 – ₦50,000"
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest text-zinc-700">PHONE NUMBER *</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g., +234 802 345 6789"
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest text-zinc-700">RATING (1-5)</label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setForm({ ...form, rating: r })}
                      className="p-1"
                    >
                      <Star className={`h-6 w-6 ${r <= form.rating ? "text-[#C9B676] fill-[#C9B676]" : "text-zinc-300"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold tracking-widest text-zinc-700">NOTES</label>
                <input
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="e.g., 4-star. Conference facilities."
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={saveHotel}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[#0E7C3E] text-white px-6 py-2 text-sm font-bold disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {saving ? "Saving..." : editing ? "Update" : "Add Hotel"}
              </button>
              <button
                onClick={cancel}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-6 py-2 text-sm font-bold"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* Hotels Table */}
        {loading ? (
          <div className="rounded-[24px] bg-white border border-purple-100 p-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-[#4C1769] mx-auto" />
            <p className="text-sm text-zinc-600 mt-3">Loading hotels...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="rounded-[24px] bg-white border border-purple-100 p-12 text-center">
            <MapPin className="h-12 w-12 text-zinc-300 mx-auto" />
            <p className="text-lg font-bold text-zinc-600 mt-3">No hotels added yet</p>
            <p className="text-sm text-zinc-500 mt-1">Click "Add Hotel" to add the first one.</p>
          </div>
        ) : (
          <div className="rounded-[24px] bg-white border border-purple-100 overflow-hidden">
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
                    <th className="px-4 py-3 text-left font-bold">Actions</th>
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
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(h)} className="p-1.5 rounded-lg hover:bg-purple-50 text-[#4C1769]">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteHotel(h.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 rounded-2xl bg-[#FFFBEB] border border-amber-200 p-4 text-sm text-center">
          <b>Note:</b> Conference Hotel and Park Inn are hardcoded on the visitors page. Additional hotels added here will appear under "More Hotels in Abeokuta".
        </div>
      </div>
    </div>
  );
}
