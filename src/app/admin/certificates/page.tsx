"use client";
import { useState } from "react";
export default function AdminCerts(){
  const [serial] = useState("CLU-2026-" + Math.random().toString(36).slice(2,8).toUpperCase());
  return <div className="mx-auto max-w-6xl px-4 py-6"><h1 className="text-xl font-black">Certificates</h1><p className="text-sm text-zinc-600">Template (logo/signatories), serial + QR, bulk generate for verified attendees, revoke/reissue, audit trail, name-correction workflow.</p><div className="mt-4 rounded-2xl bg-white border p-4">Example serial: <b className="font-mono tracking-widest">{serial}</b> • Verify at <code>/certificate/verify/{serial}</code></div></div>;
}
