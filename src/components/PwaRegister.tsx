"use client";
import { useEffect, useState } from "react";

export function PwaRegister() {
  const [deferred, setDeferred] = useState<any>(null);
  const [updateReady, setUpdateReady] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        reg.addEventListener("updatefound", () => setUpdateReady(true));
      }).catch(() => {});
    }
    const h = (e: any) => { e.preventDefault(); setDeferred(e); };
    window.addEventListener("beforeinstallprompt", h);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);
  if (!deferred && !updateReady) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[360px] z-50 rounded-2xl bg-[#1A0B2E] text-white p-4 shadow-2xl border border-white/10 flex items-center gap-3">
      <div className="flex-1">
        <div className="text-sm font-bold">{updateReady ? "Update available" : "Install Chrisland University, Abeokuta"}</div>
        <div className="text-xs text-white/70">{updateReady ? "Refresh to get the latest programme." : "Add to home screen for offline access pass."}</div>
      </div>
      {deferred && <button onClick={() => { deferred.prompt(); setDeferred(null); }} className="rounded-full bg-[#C9B676] text-[#4C1769] px-4 py-2 text-sm font-black">Install</button>}
      {updateReady && <button onClick={() => location.reload()} className="rounded-full bg-white text-[#4C1769] px-4 py-2 text-sm font-black">Refresh</button>}
      <button onClick={() => { setDeferred(null); setUpdateReady(false); }} className="text-white/60 text-xs">Dismiss</button>
    </div>
  );
}
