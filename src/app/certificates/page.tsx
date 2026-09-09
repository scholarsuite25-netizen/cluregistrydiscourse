import { Award, UserCheck, Download, Mail, Building2, PenLine, Upload } from "lucide-react";
import CertificatePreview from "@/components/certificate/CertificatePreview";

export const metadata = {
  title: "Certificates — CLU Registry Discourse 2026",
  description: "How to get your Certificate of Participation for the Maiden Registry Discourse.",
};

export default function CertificatesPage() {
  return (
    <div className="bg-[#FFFCF8] py-10 sm:py-14 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A0B2E]">Certificates</h1>
          <p className="text-base text-zinc-600 mt-2 max-w-2xl mx-auto">
            How to get your copy of the Certificate of Participation for the Maiden Registry Discourse.
          </p>
        </div>

        {/* Sample certificate */}
        <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6 sm:p-10 mb-8">
          <h2 className="text-xl font-black text-[#4C1769] flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-[#C9B676]" /> Sample Certificate
          </h2>
          <CertificatePreview name="Participant's Full Name" />
          <p className="text-xs text-zinc-500 mt-4 text-center">
            Sample design in the university colours with the university logo. The final certificate is print-ready on A4
            landscape and carries your typed name, your certificate number and your access code.
          </p>
        </div>

        {/* How to get your copy */}
        <div className="rounded-[24px] bg-[#4C1769] text-white shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Download className="h-5 w-5 text-[#C9B676]" /> How to get your copy
          </h2>
          <ol className="mt-4 space-y-4 text-sm sm:text-[15px] text-white/90 leading-relaxed">
            <li className="flex gap-3 items-start">
              <span className="h-6 w-6 rounded-full bg-[#C9B676] text-[#4C1769] grid place-items-center font-black text-xs shrink-0 mt-0.5">1</span>
              <div className="flex-1 text-justify">
                <b>Register and attend.</b> Your certificate is issued for the Maiden Registry Discourse on {`15 October 2026`}. You must be an officially registered participant who attended — physically (checked in at the venue) or online (verified in the live Zoom session).
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="h-6 w-6 rounded-full bg-[#C9B676] text-[#4C1769] grid place-items-center font-black text-xs shrink-0 mt-0.5">2</span>
              <div className="flex-1 text-justify">
                <b>Wait for the Portal release.</b> After the event, certificates are released in the <b>Portal</b>. Your name, institution and access code are matched automatically to your registration.
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="h-6 w-6 rounded-full bg-[#C9B676] text-[#4C1769] grid place-items-center font-black text-xs shrink-0 mt-0.5">3</span>
              <div className="flex-1 text-justify">
                <b>Download or receive it.</b> Sign in to the Portal with your email or access code and download the print-ready PDF. A copy is also emailed to your registered address within a week of the event, and physical attendees may collect a printed copy from the Registry on request.
              </div>
            </li>
          </ol>
        </div>

        {/* Who gets it */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6">
            <h2 className="text-lg font-black text-[#4C1769] flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[#0E7C3E]" /> Who gets a certificate
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-700 leading-relaxed">
              <li className="flex gap-3 items-start"><span className="h-5 w-5 rounded-full bg-[#0E7C3E] text-white grid place-items-center font-black text-[11px] shrink-0 mt-0.5">1</span><span className="flex-1 text-justify">All <b>officially registered participants</b> (confirmed) who physically attended the event and were <b>checked in</b> at the venue.</span></li>
              <li className="flex gap-3 items-start"><span className="h-5 w-5 rounded-full bg-[#0E7C3E] text-white grid place-items-center font-black text-[11px] shrink-0 mt-0.5">2</span><span className="flex-1 text-justify">Online participants who joined the live <b>Zoom session</b> and were verified as present (attendance is logged from the session).</span></li>
              <li className="flex gap-3 items-start"><span className="h-5 w-5 rounded-full bg-[#0E7C3E] text-white grid place-items-center font-black text-[11px] shrink-0 mt-0.5">3</span><span className="flex-1 text-justify">The <b>Guest Lecturer, Chairman, hosts</b> and <b>LOC members</b> receive appreciation / recognition certificates.</span></li>
            </ul>
            <p className="mt-4 text-xs text-zinc-500">
              One certificate is issued per registered participant, printed with the participant&apos;s full name as provided at registration.
            </p>
          </div>

          {/* Digital signatures */}
          <div className="rounded-[24px] bg-white border border-purple-100 shadow-lg p-6">
            <h2 className="text-lg font-black text-[#4C1769] flex items-center gap-2">
              <PenLine className="h-5 w-5 text-[#B25900]" /> Digital signatures — how they are added
            </h2>
            <ul className="mt-4 space-y-4 text-sm text-zinc-700 leading-relaxed">
              <li className="flex gap-3 items-start"><span className="h-5 w-5 rounded-full bg-[#B25900] text-white grid place-items-center font-black text-[11px] shrink-0 mt-0.5">1</span><span className="flex-1 text-justify">The Registrar and Vice-Chancellor sign on paper (or with a stylus/tablet).</span></li>
              <li className="flex gap-3 items-start"><span className="h-5 w-5 rounded-full bg-[#B25900] text-white grid place-items-center font-black text-[11px] shrink-0 mt-0.5">2</span><span className="flex-1 text-justify">Each signature is saved as a small image with a <b>white or transparent background</b> (PNG).</span></li>
              <li className="flex gap-3 items-start"><span className="h-5 w-5 rounded-full bg-[#B25900] text-white grid place-items-center font-black text-[11px] shrink-0 mt-0.5">3</span><span className="flex-1 text-justify">The admin uploads the two images in the <b>admin Certificates console</b>.</span></li>
              <li className="flex gap-3 items-start"><span className="h-5 w-5 rounded-full bg-[#B25900] text-white grid place-items-center font-black text-[11px] shrink-0 mt-0.5">4</span><span className="flex-1 text-justify">The signatures are <b>automatically placed</b> above each signer&apos;s name on every certificate — no manual work per certificate.</span></li>
            </ul>
            <div className="mt-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-start gap-2 p-3">
              <Upload className="h-4 w-4 text-[#B25900] mt-0.5 shrink-0" />
              <p className="text-xs text-zinc-600">Need a helping hand? The signatures can also be drawn directly in an app like Canva or WhatsApp image editor and exported — then uploaded by admin.</p>
            </div>
          </div>
        </div>

        {/* Verify + contact */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-[24px] bg-[#0E7C3E] text-white p-6 flex items-start gap-4">
            <Award className="h-8 w-8 text-[#C9B676] shrink-0" />
            <div>
              <h3 className="font-black">Online verification</h3>
              <p className="text-sm text-white/85 mt-1">
                Third parties (employers, institutions) can verify any certificate using its certificate number on the Portal — protecting the integrity of every credential issued.
              </p>
            </div>
          </div>
          <div className="rounded-[24px] bg-[#4C1769] text-white p-6 flex items-start gap-4">
            <Mail className="h-8 w-8 text-[#C9B676] shrink-0" />
            <div>
              <h3 className="font-black">Questions or corrections</h3>
              <p className="text-sm text-white/85 mt-1">
                For name corrections or certificate enquiries, contact the Registry Discourse desk and quote your access code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}