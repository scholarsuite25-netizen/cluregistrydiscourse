"use client";
import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { EVENT } from "@/lib/constants";
import Image from "next/image";

type CertSettings = Record<string, string>;

export default function CertificatePreview({
  name = "[Participant's Name]",
  certificateNo = "RD-2026-0001",
  accessCode = "XXXX-XXXX",
}: {
  name?: string;
  certificateNo?: string;
  accessCode?: string;
}) {
  const [settings, setSettings] = useState<CertSettings>({});
  const [sigErr, setSigErr] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        if (!isSupabaseConfigured) return;
        const sb = getSupabase()!;
        const { data, error } = await sb.from("certificate_settings").select("key, value");
        if (error) {
          setSigErr(true);
          return;
        }
        const map: CertSettings = {};
        (data || []).forEach((r) => (map[r.key] = r.value));
        setSettings(map);
      } catch {
        setSigErr(true);
      }
    }
    load();
  }, []);

  const registrarSig = settings["registrar_signature_url"];
  const vcSig = settings["vc_signature_url"];

  return (
    <div className="rounded-2xl border-4 border-[#C9B676] bg-[#FFFDF7] p-6 sm:p-10 w-full aspect-[1.414/1] relative overflow-hidden shadow-[0_20px_60px_rgba(76,23,105,0.25)]">
      <div className="absolute inset-3 border border-[#4C1769]/40 rounded-xl pointer-events-none" />
      <div className="absolute inset-[13px] border border-[#C9B676]/30 rounded-lg pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/clu-logo.png"
            alt="Chrisland University Logo"
            width={112}
            height={112}
            className="h-16 w-16 sm:h-24 sm:w-24 object-contain"
          />
          <div className="text-[13px] sm:text-xl font-black tracking-[0.22em] text-[#4C1769] mt-2">
            CHRISLAND UNIVERSITY, ABEOKUTA
          </div>
          <div className="text-[9px] sm:text-xs font-bold tracking-[0.3em] text-zinc-500 mt-1">
            OFFICE OF THE REGISTRAR
          </div>
        </div>

        {/* Band */}
        <div className="mt-3 sm:mt-4 bg-[#4C1769] text-[#C9B676] text-[10px] sm:text-sm font-black tracking-[0.3em] text-center py-1.5 sm:py-2 rounded-full px-4 mx-auto">
          MAIDEN REGISTRY DISCOURSE 2026
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col items-center justify-center text-center py-1 sm:py-2">
          <div className="text-[#C9B676] text-base sm:text-2xl font-black tracking-[0.35em]">
            CERTIFICATE OF PARTICIPATION
          </div>
          <div className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-[#B25900] to-transparent my-2" />
          <div className="text-[11px] sm:text-sm text-zinc-500 italic">This is to certify that</div>
          <div className="text-2xl sm:text-5xl font-black italic text-[#1A0B2E] mt-1 sm:mt-2 px-2 font-serif leading-tight">
            {name}
          </div>
          <div className="text-[11px] sm:text-sm text-[#4C1769]/90 mt-2 sm:mt-3 max-w-xl leading-relaxed font-medium">
            attended the Maiden Registry Discourse held on {EVENT.date} at Chrisland University, Abeokuta with the theme
            “Governance, Innovation and Service”.
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 max-w-md mx-auto w-full">
          <div className="flex flex-col items-center">
            {registrarSig ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={registrarSig} alt="Registrar signature" className="h-10 sm:h-14 object-contain mb-1" />
            ) : sigErr ? (
              <div className="text-[8px] sm:text-[10px] text-zinc-400 mb-1 italic">(signature not uploaded)</div>
            ) : (
              <div className="h-10 sm:h-14 grid place-items-center text-[#C9B676] font-black text-xl sm:text-2xl mb-1">
                ~
              </div>
            )}
            <div className="border-t border-zinc-400 pt-1 w-full text-center">
              <div className="text-[9px] sm:text-[11px] text-zinc-700 font-bold">Mr. S. B. Omotoso, FCIA</div>
              <div className="text-[8px] sm:text-[10px] text-zinc-500">Registrar</div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            {vcSig ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={vcSig} alt="Vice-Chancellor signature" className="h-10 sm:h-14 object-contain mb-1" />
            ) : sigErr ? (
              <div className="text-[8px] sm:text-[10px] text-zinc-400 mb-1 italic">(signature not uploaded)</div>
            ) : (
              <div className="h-10 sm:h-14 grid place-items-center text-[#C9B676] font-black text-xl sm:text-2xl mb-1">
                ~
              </div>
            )}
            <div className="border-t border-zinc-400 pt-1 w-full text-center">
              <div className="text-[9px] sm:text-[11px] text-zinc-700 font-bold">Prof. Oyedunni S. Arulogun, FAAS</div>
              <div className="text-[8px] sm:text-[10px] text-zinc-500">Vice-Chancellor</div>
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div className="flex items-center justify-between text-[8px] sm:text-[10px] font-mono text-zinc-400 mt-2 sm:mt-3">
          <span>Certificate No: {certificateNo}</span>
          <span className="hidden sm:inline">GG</span>
          <span>Access Code: {accessCode}</span>
        </div>
      </div>
    </div>
  );
}