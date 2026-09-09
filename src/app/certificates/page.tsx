import { Award, UserCheck, Download, Mail, Building2, GraduationCap } from "lucide-react";
import { EVENT } from "@/lib/constants";

export const metadata = {
  title: "Certificates — CLU Registry Discourse 2026",
  description: "Sample certificate, eligibility and how to receive your certificate for the Maiden Registry Discourse.",
};

export default function CertificatesPage() {
  return (
    <div className="bg-[#FFFCF8] py-10 sm:py-14 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A0B2E]">Certificates</h1>
          <p className="text-base text-zinc-600 mt-2 max-w-2xl mx-auto">
            Sample design, who qualifies and how every participant receives their Certificate of Participation.
          </p>
        </div>

        {/* Sample certificate */}
        <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6 sm:p-10 mb-8">
          <h2 className="text-xl font-black text-[#4C1769] flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-[#C9B676]" /> Sample Certificate
          </h2>
          {/* certificate mock */}
          <div className="rounded-2xl border-4 border-[#C9B676] bg-[#FFFDF6] p-6 sm:p-10 w-full aspect-[1.414/1] relative overflow-hidden flex flex-col">
            <div className="absolute inset-3 border border-[#4C1769]/30 rounded-xl pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full justify-between text-center">
              <div>
                <div className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-[#4C1769]">CHRISLAND UNIVERSITY, ABEOKUTA</div>
                <div className="text-[9px] sm:text-[11px] font-semibold tracking-widest text-zinc-500 mt-1">OFFICE OF THE REGISTRAR</div>
                <div className="mt-3 text-xs sm:text-sm font-black tracking-[0.2em] text-[#4C1769]">MAIDEN REGISTRY DISCOURSE 2026</div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center py-2">
                <div className="text-xs sm:text-sm font-bold tracking-widest text-[#C9B676]">CERTIFICATE OF PARTICIPATION</div>
                <div className="text-xs text-zinc-500 mt-2">This is to certify that</div>
                <div className="text-2xl sm:text-4xl font-black italic text-[#1A0B2E] mt-2 font-serif">[Participant&apos;s Name]</div>
                <div className="text-[11px] sm:text-sm text-zinc-600 mt-3 max-w-xl leading-relaxed">
                  attended the Maiden Registry Discourse held on {EVENT.date} at Chrisland University, Abeokuta with the theme “Governance, Innovation and Service”.
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 max-w-md mx-auto w-full">
                <div className="border-t border-zinc-400 pt-2">
                  <div className="text-[9px] sm:text-[11px] text-zinc-700">Mr. S. B. Omotoso, FCIA</div>
                  <div className="text-[8px] sm:text-[10px] text-zinc-500">Registrar</div>
                </div>
                <div className="border-t border-zinc-400 pt-2">
                  <div className="text-[9px] sm:text-[11px] text-zinc-700">Prof. Oyedunni S. Arulogun, FAAS</div>
                  <div className="text-[8px] sm:text-[10px] text-zinc-500">Vice-Chancellor</div>
                </div>
              </div>
              <div className="text-[8px] sm:text-[10px] font-mono text-zinc-400 mt-3">Certificate No: RD-2026-0001 • Access Code: XXXX-XXXX</div>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-4 text-center">
            Sample design shown above. The final certificate is print-ready on A4 landscape with the university seal.
          </p>
        </div>

        {/* Who gets it */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6">
            <h2 className="text-lg font-black text-[#4C1769] flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[#0E7C3E]" /> Who gets a certificate
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-700 leading-relaxed">
              <li className="flex gap-2"><span className="text-[#0E7C3E] font-black">1.</span> All <b>officially registered participants</b> (confirmed) who physically attended the event and were <b>checked in</b> at the venue.</li>
              <li className="flex gap-2"><span className="text-[#0E7C3E] font-black">2.</span> Online participants who joined the live <b>Zoom session</b> and were verified as present (attendance is logged from the session).</li>
              <li className="flex gap-2"><span className="text-[#0E7C3E] font-black">3.</span> The <b>Guest Lecturer, Chairman, hosts</b> and <b>LOC members</b> receive appreciation / recognition certificates.</li>
            </ul>
            <p className="mt-4 text-xs text-zinc-500">
              One certificate is issued per registered participant, printed with the participant&apos;s full name as provided at registration.
            </p>
          </div>

          <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6">
            <h2 className="text-lg font-black text-[#4C1769] flex items-center gap-2">
              <Download className="h-5 w-5 text-[#4C1769]" /> How you receive your copy
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-700 leading-relaxed">
              <li className="flex gap-2"><span className="text-[#4C1769] font-black">1.</span> <b>Portal download:</b> after the event, sign in to the <b>Portal</b> with your email or access code and download your certificate as a print-ready PDF.</li>
              <li className="flex gap-2"><span className="text-[#4C1769] font-black">2.</span> <b>By email:</b> a copy is emailed to the address you registered with, within a week after the event.</li>
              <li className="flex gap-2"><span className="text-[#4C1769] font-black">3.</span> <b>Printed copy:</b> physical attendees may pick up a printed copy at the Registry, University Secretariat, on request.</li>
            </ul>
            <p className="mt-4 text-xs text-zinc-500">
              Every certificate carries a unique certificate number and your access code, so it can be verified online.
            </p>
          </div>
        </div>

        {/* Verification note */}
        <div className="rounded-[24px] bg-[#4C1769] text-white p-6 flex items-start gap-4">
          <GraduationCap className="h-8 w-8 text-[#C9B676] shrink-0" />
          <div>
            <h3 className="font-black">Online verification</h3>
            <p className="text-sm text-white/80 mt-1">
              Third parties (employers, institutions) can verify any certificate using its certificate number on the Portal — protecting the integrity of every credential issued.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}