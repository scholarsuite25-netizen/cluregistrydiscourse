"use client";
import { useEffect, useRef, useState } from "react";

export default function CheckinPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [code, setCode] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      } catch {}
    }
    init();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const regs: any[] = JSON.parse(localStorage.getItem("clu_regs") || "[]");
    const found = regs.find((r) => (r.access_code || r.accessCode) === code.trim().toUpperCase());
    if (!found) { setResult("Not found"); return; }
    const key = `clu_checkin_${found.id}`;
    if (localStorage.getItem(key)) { setResult(`Already checked in at ${localStorage.getItem(key)}`); return; }
    const now = new Date().toISOString();
    localStorage.setItem(key, now);
    setLog((l) => [`${found.first_name} ${found.surname} • ${found.access_code || found.accessCode} • ${now}`, ...l]);
    setResult(`Checked in: ${found.first_name} ${found.surname} at ${new Date(now).toLocaleString()}`);
  }

  return (
    <div className="bg-[#F8F5FF] py-6 min-h-[70vh]">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-xl font-black">QR Check-in (Staff)</h1>
        <p className="text-sm text-zinc-600">Idempotent: repeat scans show “already checked in” with original time, not a second attendance.</p>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-black overflow-hidden aspect-[4/3] relative">
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
            <div className="absolute inset-0 border-[3px] border-[#C9B676]/60 m-8 rounded-2xl pointer-events-none" />
            <div className="absolute bottom-2 left-2 right-2 text-center text-xs text-white/80">Camera scanner — align QR • Manual fallback below</div>
          </div>
          <div className="rounded-2xl bg-white border p-4">
            <form onSubmit={handleLookup} className="flex gap-2">
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter access code (e.g. AB3D9F2K)" className="flex-1 rounded-xl border px-3 py-3 font-mono tracking-widest uppercase text-sm" />
              <button className="rounded-full bg-[#4C1769] text-white px-5 py-3 text-sm font-bold">Check in</button>
            </form>
            {result && <div className="mt-3 rounded-xl bg-purple-50 border border-purple-100 p-3 text-sm font-semibold">{result}</div>}
            <div className="mt-4 text-xs font-bold tracking-widest">RECENT CHECK-INS</div>
            <ul className="mt-2 space-y-1 text-xs max-h-[220px] overflow-auto">{log.map((l, i) => <li key={i} className="border-b py-1">{l}</li>)}{log.length===0 && <li className="text-zinc-500">No check-ins yet</li>}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
