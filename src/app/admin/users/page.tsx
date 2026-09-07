"use client";
import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Users, Plus, Pencil, Trash2, Save, X, RefreshCw, Shield, ShieldCheck, UserCheck } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin", desc: "Full access to everything", icon: ShieldCheck },
  { value: "content_admin", label: "Content Admin", desc: "Registrations, programme, materials, people, check-in", icon: Shield },
  { value: "checkin_staff", label: "Check-in Staff", desc: "Registrations and attendance check-in", icon: UserCheck },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "", role: "content_admin" });
  const [saving, setSaving] = useState(false);

  async function loadUsers() {
    setLoading(true);
    setErr(null);
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { data, error } = await sb.from("admin_users").select("*").order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        setUsers(data || []);
      }
    } catch (e: any) {
      setErr(e.message);
    }
    setLoading(false);
  }

  useEffect(() => { loadUsers(); }, []);

  async function createUser() {
    setSaving(true);
    setErr(null);
    try {
      if (!form.email || !form.password) throw new Error("Email and password are required");
      if (form.password.length < 8) throw new Error("Password must be at least 8 characters");

      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        // Create auth user via admin API
        const res = await fetch("/api/admin-users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password, role: form.role }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to create user");

        setAdding(false);
        setForm({ email: "", password: "", role: "content_admin" });
        await loadUsers();
      }
    } catch (e: any) {
      setErr(e.message);
    }
    setSaving(false);
  }

  async function updateUserRole(id: string, newRole: string) {
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { error } = await sb.from("admin_users").update({ role: newRole }).eq("id", id);
        if (error) throw new Error(error.message);
        await loadUsers();
      }
    } catch (e: any) {
      setErr(e.message);
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Remove this admin user? They will no longer be able to access the admin panel.")) return;
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { error } = await sb.from("admin_users").delete().eq("id", id);
        if (error) throw new Error(error.message);
        await loadUsers();
      }
    } catch (e: any) {
      setErr(e.message);
    }
  }

  function getRoleInfo(role: string) {
    return ROLE_OPTIONS.find((r) => r.value === role) || ROLE_OPTIONS[1];
  }

  return (
    <div className="py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A0B2E]">Admin Users</h1>
          <p className="text-sm text-zinc-600 mt-1">Manage who can access the admin panel and what they can do.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadUsers} className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-bold">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button onClick={() => { setAdding(true); setEditing(null); setForm({ email: "", password: "", role: "content_admin" }); }} className="inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-4 py-2 text-sm font-bold">
            <Plus className="h-4 w-4" /> Add Admin
          </button>
        </div>
      </div>

      {err && <div className="rounded-2xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-6">{err}</div>}

      {/* Add Form */}
      {adding && (
        <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6 mb-6">
          <h2 className="text-lg font-black text-[#1A0B2E] mb-4">Add New Admin User</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold tracking-widest text-zinc-700">EMAIL *</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="admin@example.com" className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold tracking-widest text-zinc-700">PASSWORD *</label>
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Min 8 characters" className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold tracking-widest text-zinc-700">ROLE *</label>
              <div className="grid sm:grid-cols-3 gap-3 mt-2">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-3 rounded-xl border-2 text-left transition ${
                      form.role === r.value ? "border-[#4C1769] bg-purple-50" : "border-zinc-200 hover:border-purple-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <r.icon className={`h-5 w-5 ${form.role === r.value ? "text-[#4C1769]" : "text-zinc-400"}`} />
                      <span className="text-sm font-bold">{r.label}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={createUser} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#0E7C3E] text-white px-6 py-2 text-sm font-bold disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? "Creating..." : "Create User"}
            </button>
            <button onClick={() => setAdding(false)} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-6 py-2 text-sm font-bold">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="rounded-[24px] bg-white border border-purple-100 p-12 text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#4C1769] mx-auto" />
          <p className="text-sm text-zinc-600 mt-3">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-[24px] bg-white border border-purple-100 p-12 text-center">
          <Users className="h-12 w-12 text-zinc-300 mx-auto" />
          <p className="text-lg font-bold text-zinc-600 mt-3">No admin users</p>
        </div>
      ) : (
        <div className="rounded-[24px] bg-white border border-purple-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#4C1769] text-white">
                  <th className="px-4 py-3 text-left font-bold">Email</th>
                  <th className="px-4 py-3 text-left font-bold">Role</th>
                  <th className="px-4 py-3 text-left font-bold">Access Level</th>
                  <th className="px-4 py-3 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const roleInfo = getRoleInfo(u.role);
                  return (
                    <tr key={u.id} className={`border-b border-zinc-100 ${i % 2 === 0 ? "bg-white" : "bg-purple-50/30"}`}>
                      <td className="px-4 py-3 font-bold text-[#1A0B2E]">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value)}
                          className="rounded-lg border border-zinc-200 px-2 py-1 text-xs font-bold bg-white"
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">{roleInfo.desc}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Remove user">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Legend */}
      <div className="mt-6 rounded-2xl bg-white border border-purple-100 p-5">
        <h3 className="text-sm font-bold text-[#1A0B2E] mb-3">Role Permissions</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          {ROLE_OPTIONS.map((r) => (
            <div key={r.value} className="flex items-start gap-2">
              <r.icon className="h-4 w-4 text-[#4C1769] mt-0.5 shrink-0" />
              <div>
                <div className="font-bold">{r.label}</div>
                <div className="text-zinc-500">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
