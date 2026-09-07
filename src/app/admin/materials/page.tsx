"use client";
import { useEffect, useState, useRef } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { FolderOpen, Upload, Plus, Pencil, Trash2, Save, X, RefreshCw, FileText, Download, Eye, ExternalLink } from "lucide-react";

type Material = {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
};

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "image/gif",
];

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadMaterials() {
    setLoading(true);
    setErr(null);
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const { data, error } = await sb.from("materials").select("*").order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        setMaterials(data || []);
      }
    } catch (e: any) {
      setErr(e.message);
    }
    setLoading(false);
  }

  useEffect(() => { loadMaterials(); }, []);

  async function handleUpload() {
    if (!file || !form.title) return;
    setUploading(true);
    setErr(null);

    try {
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error("File type not allowed. Use PDF, DOCX, PPTX, or images.");
      }
      if (file.size > MAX_SIZE) {
        throw new Error("File too large. Maximum 25MB.");
      }

      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${form.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.${ext}`;

        // Upload file to storage
        const { error: uploadError } = await sb.storage.from("materials").upload(fileName, file);
        if (uploadError) throw new Error("Upload failed: " + uploadError.message);

        // Get public URL
        const { data: urlData } = sb.storage.from("materials").getPublicUrl(fileName);

        // Save metadata to table
        const { error: dbError } = await sb.from("materials").insert({
          title: form.title,
          description: form.description,
          file_url: urlData.publicUrl,
          file_type: file.type,
          file_size: file.size,
        });
        if (dbError) throw new Error(dbError.message);

        setForm({ title: "", description: "" });
        setFile(null);
        if (fileRef.current) fileRef.current.value = "";
        await loadMaterials();
      }
    } catch (e: any) {
      setErr(e.message);
    }
    setUploading(false);
  }

  async function deleteMaterial(id: string, fileUrl: string) {
    if (!confirm("Delete this material?")) return;
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase()!;
        // Extract file name from URL
        const parts = fileUrl.split("/");
        const fileName = parts[parts.length - 1];
        await sb.storage.from("materials").remove([fileName]);
        const { error } = await sb.from("materials").delete().eq("id", id);
        if (error) throw new Error(error.message);
        await loadMaterials();
      }
    } catch (e: any) {
      setErr(e.message);
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function getFileIcon(type: string) {
    if (type.includes("pdf")) return "📄";
    if (type.includes("word") || type.includes("document")) return "📝";
    if (type.includes("presentation") || type.includes("powerpoint")) return "📊";
    if (type.includes("image")) return "🖼️";
    return "📁";
  }

  return (
    <div className="py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A0B2E]">Materials Library</h1>
          <p className="text-sm text-zinc-600 mt-1">Upload and manage materials for participants. PDF, DOCX, PPTX, images (max 25MB).</p>
        </div>
        <button onClick={loadMaterials} className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-bold">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {err && <div className="rounded-2xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-6">{err}</div>}

      {/* Upload Form */}
      <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6 mb-6">
        <h2 className="text-lg font-black text-[#1A0B2E] mb-4">Upload New Material</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold tracking-widest text-zinc-700">TITLE *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Event Programme"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold tracking-widest text-zinc-700">DESCRIPTION</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold tracking-widest text-zinc-700">FILE *</label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm"
            />
            {file && (
              <p className="text-xs text-zinc-500 mt-1">{getFileIcon(file.type)} {file.name} ({formatSize(file.size)})</p>
            )}
          </div>
        </div>
        <button
          onClick={handleUpload}
          disabled={uploading || !form.title || !file}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-6 py-3 text-sm font-bold disabled:opacity-50"
        >
          <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload Material"}
        </button>
      </div>

      {/* Materials List */}
      {loading ? (
        <div className="rounded-[24px] bg-white border border-purple-100 p-12 text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#4C1769] mx-auto" />
          <p className="text-sm text-zinc-600 mt-3">Loading materials...</p>
        </div>
      ) : materials.length === 0 ? (
        <div className="rounded-[24px] bg-white border border-purple-100 p-12 text-center">
          <FolderOpen className="h-12 w-12 text-zinc-300 mx-auto" />
          <p className="text-lg font-bold text-zinc-600 mt-3">No materials uploaded yet</p>
          <p className="text-sm text-zinc-500 mt-1">Upload your first material above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m) => (
            <div key={m.id} className="rounded-[20px] bg-white border border-purple-100 p-5 hover:shadow-lg transition">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{getFileIcon(m.file_type)}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[#1A0B2E] truncate">{m.title}</h3>
                  {m.description && <p className="text-xs text-zinc-500 mt-0.5 truncate">{m.description}</p>}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                <span>{formatSize(m.file_size)}</span>
                <span>{new Date(m.created_at).toLocaleDateString()}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <a
                  href={m.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-full bg-[#4C1769] text-white px-3 py-2 text-xs font-bold hover:bg-[#3a1155]"
                >
                  <ExternalLink className="h-3 w-3" /> Open
                </a>
                <a
                  href={m.file_url}
                  download
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-full bg-[#0E7C3E] text-white px-3 py-2 text-xs font-bold hover:bg-[#0a6431]"
                >
                  <Download className="h-3 w-3" /> Download
                </a>
                <button
                  onClick={() => deleteMaterial(m.id, m.file_url)}
                  className="p-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
