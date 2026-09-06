"use client";
import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

type Activity = { name: string; org: string; timeAgo: string };

const fallback: Activity[] = []; // no fake data in prod — show honest empty state

export function ActivityWidget() {
  const [count, setCount] = useState<number | null>(null);
  const [items, setItems] = useState<Activity[]>([]);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        const c = Number(localStorage.getItem("clu_reg_count") || "0");
        setCount(c);
        try {
          const raw = JSON.parse(localStorage.getItem("clu_activity") || "[]");
          setItems(raw.slice(0, 3));
        } catch { setItems([]); }
        return;
      }
      const sb = getSupabase()!;
      const { count: cnt } = await sb.from("registrations").select("id", { count: "exact", head: true }).eq("status", "confirmed").eq("public_activity_opt_in", true);
      setCount(cnt ?? 0);
      const { data } = await sb.from("public_activity_view").select("masked_name, organisation, created_at").order("created_at", { ascending: false }).limit(4);
      if (data) setItems(data.map((r: any) => ({ name: r.masked_name, org: r.organisation || "", timeAgo: "recently" })));
    }
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-3xl bg-white border border-purple-100 shadow-xl shadow-purple-900/5 p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-[#4C1769]">Live registrations</h4>
        <span className="text-xs font-bold tracking-widest text-white bg-[#4C1769] px-3 py-1 rounded-full">{count === null ? "…" : `${count} confirmed`}</span>
      </div>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
          Be among the first to register — your name appears here only if you opt-in for public activity.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex items-center gap-3 rounded-2xl bg-purple-50/70 px-3 py-2.5">
              <span className="h-8 w-8 rounded-full bg-[#4C1769] text-white grid place-items-center text-xs font-black">{it.name.charAt(0)}</span>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{it.name} {it.org ? `• ${it.org}` : ""}</div>
                <div className="text-xs text-zinc-500">{it.timeAgo}</div>
              </div>
              <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[11px] text-zinc-500">Privacy-safe • Only consenting registrations</p>
    </div>
  );
}
