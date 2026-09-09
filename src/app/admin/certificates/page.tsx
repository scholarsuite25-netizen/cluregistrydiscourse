"use client";
import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Award,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  PenLine,
  Upload,
  X,
  Trash2,
} from "lucide-react";
import CertificatePreview from "@/components/certificate/CertificatePreview";

export default function AdminCertsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, eligible: 0 });
  const [preview, setPreview] = useState<any | null>(null);

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [sigErr, setSigErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { data } = await sb
          .from("registrations")
          .select("id, first_name, middle_name, surname, email, institution, access_code, checked_in, status")
          .eq("status", "confirmed");
        if (data) {
          const checkedIn = data.filter((r) => r.checked_in);
          setRegistrations(data);
          setStats({ total: data.length, checkedIn: checkedIn.length, eligible: checkedIn.length });
        }
      }
    } catch {}
    setLoading(false);
  }

  async function loadSettings() {
    setSigErr(null);
    try {
      if (!isSupabaseConfigured) return;
      const sb = getSupabase()!;
      const { data, error } = await sb.from("certificate_settings").select("key, value");
      if (error) {
        setSigErr(error.message + " — create the certificate_settings table (SQL provided on request).");
        return;
      }
      const map: Record<string, string> = {};
      (data || []).forEach((r) => (map[r.key] = r.value));
      setSettings(map);
    } catch (e: any) {
      setSigErr(e.message);
    }
  }

  useEffect(() => {
    loadData();
    loadSettings();
  }, []);

  async function uploadSignature(signer: "registrar" | "vc", file: File) {
    setSigErr(null);
    setUploading(signer);
    try {
      if (!file) return;
      const sb = getSupabase()!;
      if (!sb) throw new Error("Supabase not configured");

      const fileName = signer === "registrar" ? "registrar-signature.png" : "vc-signature.png";
      const { error: upErr } = await sb.storage.from("certificate-signatures").upload(fileName, file, { upsert: true });
      if (upErr) throw new Error("Upload failed: " + upErr.message);

      const { data: urlData } = sb.storage.from("certificate-signatures").getPublicUrl(fileName);

      const key = signer === "registrar" ? "registrar_signature_url" : "vc_signature_url";
      const { error: dbErr } = await sb.from("certificate_settings").upsert(
        { key, value: urlData.publicUrl },
        { onConflict: "key" }
      );
      if (dbErr) throw new Error("Save failed: " + dbErr.message);

      await loadSettings();
    } catch (e: any) {
      setSigErr(e.message);
    }
    setUploading(null);
  }

  async function removeSignature(signer: "registrar" | "vc") {
    setSigErr(null);
    try {
      const sb = getSupabase()!;
      const fileName = signer === "registrar" ? "registrar-signature.png" : "vc-signature.png";
      await sb.storage.from("certificate-signatures").remove([fileName]);
      const key = signer === "registrar" ? "registrar_signature_url" : "vc_signature_url";
      await sb.from("certificate_settings").delete().eq("key", key);
      await loadSettings();
    } catch (e: any) {
      setSigErr(e.message);
    }
  }

  function fullName(r: any) {
    return [r.first_name, r.middle_name, r.surname].filter(Boolean).join(" ");
  }

  const filtered = registrations.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.first_name?.toLowerCase().includes(q) ||
      r.surname?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.access_code?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-6 px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A0B2E]">Certificates</h1>
          <p className="text-sm text-zinc-600 mt-1">
            Upload digital signatures, preview certificates with participant names and manage eligibility.
          </p>
        </div>
        <button onClick={() => { loadData(); loadSettings(); }} className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-bold">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {sigErr && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm mb-6">{sigErr}</div>
      )}

      {/* Digital signatures */}
      <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6 mb-6">
        <h2 className="text-lg font-black text-[#1A0B2E] flex items-center gap-2">
          <PenLine className="h-5 w-5 text-[#B25900]" /> Digital Signatures
        </h2>
        <p className="text-sm text-zinc-600 mt-1">
          Upload a transparent/white-background PNG of each signer&apos;s signature. It appears automatically under the
          signer&apos;s name on every certificate.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 mt-5">
          <div className="rounded-2xl border border-purple-100 bg-[#FBF7FF] p-4">
            <div className="font-bold text-[#4C1769] text-sm">Registrar — Mr. S. B. Omotoso, FCIA</div>
            <div className="mt-3 min-h-[64px] flex items-center justify-center bg-white rounded-xl border border-dashed border-zinc-300 p-2">
              {settings["registrar_signature_url"] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings["registrar_signature_url"]} alt="Registrar signature" className="h-16 object-contain" />
              ) : (
                <span className="text-xs text-zinc-400">No signature uploaded</span>
              )}
            </div>
            <label className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#4C1769] text-white px-4 py-2 text-xs font-bold cursor-pointer">
              <Upload className="h-3 w-3" /> {uploading === "registrar" ? "Uploading..." : "Upload Signature"}
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadSignature("registrar", e.target.files[0])}
              />
            </label>
            {settings["registrar_signature_url"] && (
              <button onClick={() => removeSignature("registrar")} className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full border border-red-200 text-red-600 px-4 py-2 text-xs font-bold">
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            )}
          </div>
          <div className="rounded-2xl border border-purple-100 bg-[#FBF7FF] p-4">
            <div className="font-bold text-[#4C1769] text-sm">Vice-Chancellor — Prof. Oyedunni S. Arulogun, FAAS</div>
            <div className="mt-3 min-h-[64px] flex items-center justify-center bg-white rounded-xl border border-dashed border-zinc-300 p-2">
              {settings["vc_signature_url"] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings["vc_signature_url"]} alt="Vice-Chancellor signature" className="h-16 object-contain" />
              ) : (
                <span className="text-xs text-zinc-400">No signature uploaded</span>
              )}
            </div>
            <label className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#4C1769] text-white px-4 py-2 text-xs font-bold cursor-pointer">
              <Upload className="h-3 w-3" /> {uploading === "vc" ? "Uploading..." : "Upload Signature"}
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadSignature("vc", e.target.files[0])}
              />
            </label>
            {settings["vc_signature_url"] && (
              <button onClick={() => removeSignature("vc")} className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full border border-red-200 text-red-600 px-4 py-2 text-xs font-bold">
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-4">
          Tip: crop the signature to only the ink (white background), PNG recommended, max 2MB.
        </p>
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
              <thead>
                <tr className="bg-[#4C1769] text-white">
                  <th className="px-4 py-3 text-left font-bold">Name</th>
                  <th className="px-4 py-3 text-left font-bold">Email</th>
                  <th className="px-4 py-3 text-left font-bold">Institution</th>
                  <th className="px-4 py-3 text-left font-bold">Access Code</th>
                  <th className="px-4 py-3 text-left font-bold">Checked In</th>
                  <th className="px-4 py-3 text-left font-bold">Certificate</th>
                  <th className="px-4 py-3 text-center font-bold">Preview</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} className={`border-b border-zinc-100 ${i % 2 === 0 ? "bg-white" : "bg-purple-50/30"}`}>
                    <td className="px-4 py-3 font-bold text-[#1A0B2E]">{fullName(r)}</td>
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
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setPreview(r)} className="inline-flex items-center gap-1 rounded-full border border-[#4C1769] text-[#4C1769] px-3 py-1.5 text-xs font-bold hover:bg-[#4C1769] hover:text-white transition">
                        <Eye className="h-3 w-3" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview popup */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setPreview(null)}>
          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-white font-black text-lg">{fullName(preview)}</div>
                <div className="text-white/70 text-xs">{preview.institution} • Access Code: {preview.access_code}</div>
              </div>
              <button onClick={() => setPreview(null)} className="h-10 w-10 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20">
                <X className="h-5 w-5" />
              </button>
            </div>
            <CertificatePreview name={fullName(preview)} certificateNo={`RD-2026-${String((preview.id || "").slice(0, 4)).toUpperCase()}`} accessCode={preview.access_code || "XXXX-XXXX"} />
            <div className="text-white/60 text-xs mt-3 text-center">
              This is a live preview with the participant&apos;s full name. Physical and online attendance filtering applies before release.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}