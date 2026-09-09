"use client";
import { useMemo, useState } from "react";
import JSZip from "jszip";
import { FileDown, PackageCheck, RefreshCw, AlertTriangle } from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { buildCertificatePdf } from "@/lib/certificate-pdf";

function fullName(r: any) {
  return [r.first_name, r.middle_name, r.surname].filter(Boolean).join(" ");
}

function safeFileName(s: string) {
  return s.replace(/[\\/:*?"<>|]+/g, "-").trim();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

export default function CertificateGenerator({
  registrations,
  settings,
}: {
  registrations: any[];
  settings: Record<string, string>;
}) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eligible = useMemo(
    () => registrations.filter((r) => r.checked_in),
    [registrations]
  );

  async function fetchBuf(url: string): Promise<Uint8Array | null> {
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) return null;
      return new Uint8Array(await res.arrayBuffer());
    } catch {
      return null;
    }
  }

  async function handleGenerate() {
    setError(null);
    setMessage(null);
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured on this deployment.");
      return;
    }
    if (eligible.length === 0) {
      setError("No checked-in participants yet. Check participants in at the venue first, then generate.");
      return;
    }
    setRunning(true);
    try {
      const sb = getSupabase()!;

      // 1. Stable certificate numbers (reuse existing mapping)
      const { data: certRows } = await sb
        .from("certificates")
        .select("registration_id, certificate_no");
      const known: Record<string, string> = {};
      let maxNum = 0;
      (certRows || []).forEach((c) => {
        known[c.registration_id] = c.certificate_no;
        const m = /RD-2026-(\d+)/.exec(c.certificate_no || "");
        if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
      });

      let next = maxNum + 1;
      const missing = eligible.filter((r) => !known[r.id]);
      for (const r of missing) {
        const no = `RD-2026-${String(next).padStart(4, "0")}`;
        const { error: insErr } = await sb
          .from("certificates")
          .insert({ registration_id: r.id, certificate_no: no });
        if (insErr) {
          setError(
            `Could not save certificate numbers: ${insErr.message}. Please run the migration SQL (migrations/008_certificates.sql) in the Supabase SQL Editor, then try again.`
          );
          setRunning(false);
          return;
        }
        known[r.id] = no;
        next++;
      }

      // 2. Load signature images
      const [sigR, sigV] = await Promise.all([
        settings["registrar_signature_url"] ? fetchBuf(settings["registrar_signature_url"]) : Promise.resolve(null),
        settings["vc_signature_url"] ? fetchBuf(settings["vc_signature_url"]) : Promise.resolve(null),
      ]);
      if (!sigR || !sigV) {
        setMessage(
          "Note: one or both digital signatures are not uploaded. Those certificates will show a ~ placeholder above the signer's name. You can upload the signatures and regenerate later (numbers are kept)."
        );
      }

      // 3. Build one PDF per participant, then zip
      const zip = new JSZip();
      const folder = zip.folder("CLU-Registry-Discourse-Certificates")!;
      for (let i = 0; i < eligible.length; i++) {
        const r = eligible[i];
        const name = fullName(r);
        const no = known[r.id] || `RD-2026-${String(i + 1).padStart(4, "0")}`;
        const pdf = await buildCertificatePdf({
          name,
          certificateNo: no,
          accessCode: r.access_code || "XXXX-XXXX",
          images: { registrar: sigR, vc: sigV },
        });
        folder.file(`${no} - ${safeFileName(name)}.pdf`, pdf);
        setProgress({ done: i + 1, total: eligible.length });
      }

      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, "CLU-Registry-Discourse-Certificates.zip");
      setMessage(`Done — ${eligible.length} certificate PDF${eligible.length === 1 ? "" : "s"} generated. Email or WhatsApp each PDF to its participant.`);
    } catch (e: any) {
      setError(e?.message || "Generation failed unexpectedly.");
    }
    setRunning(false);
  }

  return (
    <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6 mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[#1A0B2E] flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-[#0E7C3E]" /> Generate certificates (ZIP)
          </h2>
          <p className="text-sm text-zinc-600 mt-1 max-w-2xl">
            Generates one print-quality PDF per <b>checked-in participant</b> (with the university logo, digital
            signatures, certificate number and access code) and downloads a ZIP. You then send each PDF to its
            participant by email or WhatsApp. Certificate numbers stay the same if you regenerate.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={running || eligible.length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-[#0E7C3E] text-white px-5 py-2.5 text-sm font-black hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {running ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
          {running ? `Generating ${progress.done}/${progress.total}...` : `Generate & Download ZIP (${eligible.length})`}
        </button>
      </div>

      {progress.done > 0 && running && (
        <div className="mt-4 h-2 rounded-full bg-purple-100 overflow-hidden">
          <div
            className="h-full bg-[#0E7C3E] transition-all"
            style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }}
          />
        </div>
      )}

      {message && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-sm">
          <PackageCheck className="h-4 w-4 mt-0.5 shrink-0" /> {message}
        </div>
      )}
      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}