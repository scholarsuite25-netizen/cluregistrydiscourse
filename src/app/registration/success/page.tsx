"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { CheckCircle2, Download, Mail, QrCode, Calendar, MapPin } from "lucide-react";
import { EVENT } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const [data, setData] = useState<any>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const raw = sessionStorage.getItem("clu_success") || localStorage.getItem("clu_last_reg");
    if (raw) {
      const d = JSON.parse(raw);
      // normalize
      setData(d);
      const token = d.qrToken || d.qr_token || d.accessCode;
      QRCode.toDataURL(JSON.stringify({ t: token, e: d.email }), { width: 280, margin: 1, color: { dark: "#4C1769", light: "#ffffff" } }).then(setQrDataUrl).catch(() => {});
    }
  }, []);

  function handleDownload() {
    if (!data) return;
    // generate simple pass via canvas (fallback to QR + details)
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>CLU Access Pass - ${data.name}</title></head>
      <body style="font-family: system-ui; display:flex; justify-content:center; padding:24px; background:#f8f5ff">
        <div style="background:white; border:2px solid #4C1769; border-radius:24px; padding:24px; max-width:520px; width:100%">
          <div style="background:#4C1769; color:white; border-radius:16px; padding:16px; text-align:center">
            <div style="font-weight:900; letter-spacing:0.08em">CLU REGISTRY DISCOURSE</div>
            <div style="font-size:12px; color:#C9B676">GOVERNANCE • INNOVATION • SERVICE</div>
          </div>
          <h2 style="margin:16px 0 4px; font-weight:900">${data.name}</h2>
          <p style="margin:0; color:#6b7280; font-size:13px">${data.email} • ${data.mode || data.participation_mode || ""}</p>
          <div style="margin:16px 0; border:1px dashed #C9B676; border-radius:16px; padding:16px; text-align:center">
            <div style="font-size:12px; letter-spacing:0.2em; font-weight:800; color:#4C1769">ACCESS CODE</div>
            <div style="font-size:32px; font-weight:900; letter-spacing:0.12em; color:#4C1769">${data.accessCode || data.access_code}</div>
            ${qrDataUrl ? `<img src="${qrDataUrl}" style="width:200px; height:200px; margin:12px auto; display:block" />` : ""}
            <div style="font-size:11px; color:#6b7280">Present this QR at check-in • ${EVENT.date} • ${EVENT.venue}</div>
          </div>
          <p style="font-size:11px; color:#6b7280; text-align:center">Generated securely • Keep private • Verify at /certificate/verify</p>
        </div>
        <script>window.print()</script>
      </body></html>
    `);
    w.document.close();
  }

  if (!data) return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-black">No recent registration found</h1>
      <p className="text-sm text-zinc-600 mt-2">Please register or retrieve your pass via the Portal.</p>
      <div className="mt-6 flex justify-center gap-3"><Link href="/register"><Button>Register</Button></Link><Link href="/portal"><Button variant="outline">Portal</Button></Link></div>
    </div>
  );

  return (
    <div className="bg-[#F8F5FF] py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-[28px] bg-white border border-purple-100 shadow-xl overflow-hidden">
          <div className="bg-[#4C1769] text-white px-6 py-6 flex gap-4 items-start">
            <span className="h-12 w-12 rounded-full bg-white text-[#4C1769] grid place-items-center shrink-0"><CheckCircle2 /></span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">Registration confirmed — welcome!</h1>
              <p className="text-sm text-white/80 mt-1">{data.name} • {data.email} • {data.mode || data.participation_mode} • Access code generated securely.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-6 p-6">
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-dashed border-[#C9B676] bg-[#FFFBEB] p-6 text-center">
                <div className="text-xs font-bold tracking-[0.2em] text-[#4C1769]">YOUR ACCESS CODE</div>
                <div className="mt-1 text-3xl sm:text-4xl font-black tracking-[0.14em] text-[#4C1769]">{data.accessCode || data.access_code}</div>
                <div className="mt-2 text-xs text-zinc-600">Keep this code private. You can also retrieve it via email magic link in Portal.</div>
                {qrDataUrl && <img src={qrDataUrl} alt="QR code" className="mx-auto mt-4 h-48 w-48 border-8 border-white rounded-2xl shadow" />}
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white border px-3 py-1 text-xs font-semibold"><QrCode className="h-3 w-3" /> Check-in QR — do not share publicly</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleDownload} className="gap-2"><Download className="h-4 w-4" /> Download / Print Pass</Button>
                <Link href="/portal" className="inline-flex items-center gap-2 rounded-full border-2 border-[#4C1769] px-5 py-2.5 text-sm font-bold text-[#4C1769]"><Mail className="h-4 w-4" /> Go to Portal</Link>
              </div>
              <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4 text-sm leading-relaxed">
                <b className="text-[#4C1769]">Delivery status</b>
                <ul className="mt-2 space-y-1 text-zinc-700">
                  <li>• Email: <span className="font-semibold text-emerald-700">queued / sent</span> (check inbox & spam for {EVENT.email})</li>
                  <li>• WhatsApp: <span className="font-semibold">sent only if you opted-in and provider is configured</span> — otherwise click-to-chat remains available.</li>
                  <li>• Web Push: <span className="font-semibold">permission prompt appears in Portal</span> after sign-in.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-[#4C1769] text-white p-5">
                <h3 className="font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-[#C9B676]" /> Next steps</h3>
                <ol className="mt-3 space-y-2 text-sm text-white/85 list-decimal list-inside">
                  <li>Save this page or download your pass.</li>
                  <li>Add to calendar: <a href="/programme" className="underline text-[#C9B676]">Programme page → .ics</a></li>
                  <li>Online participants: Zoom link appears in Portal at admin-configured release time.</li>
                  <li>Physical: arrive from 08:00 WAT at Auditorium Foyer for kit collection.</li>
                  <li>Show QR at check-in — attendance required for certificate.</li>
                </ol>
              </div>
              <div className="rounded-2xl border p-4">
                <h4 className="font-bold text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-[#4C1769]" /> Event details</h4>
                <p className="text-sm mt-1"><b>{EVENT.date}</b> • {EVENT.startTime}</p>
                <p className="text-sm text-zinc-600">{EVENT.venue}</p>
                <p className="text-sm mt-2">Zoom: {EVENT.zoomTopic} • {EVENT.zoomTime}</p>
                <p className="text-xs text-zinc-500 mt-2">Zoom join URL is released only to confirmed online participants at the configured time — not in public source.</p>
              </div>
              <Link href="/" className="block text-center text-sm font-bold text-[#4C1769] underline">Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
