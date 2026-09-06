"use client";
import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { UserPlus, X } from "lucide-react";

type Registration = { name: string; institution: string; timeAgo: string };

export function RegistrationToast() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<Registration | null>(null);
  const [queue, setQueue] = useState<Registration[]>([]);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        // Use localStorage fallback
        try {
          const raw = JSON.parse(localStorage.getItem("clu_activity") || "[]");
          if (raw.length > 0) setQueue(raw.slice(0, 5));
        } catch {}
        return;
      }
      const sb = getSupabase()!;
      const { data } = await sb.from("public_activity_view")
        .select("masked_name, organisation, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) {
        setQueue(data.map((r: any) => ({
          name: r.masked_name,
          institution: r.organisation || "",
          timeAgo: "recently"
        })));
      }
    }
    load();
    const id = setInterval(load, 20000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;

    const showNext = () => {
      if (queue.length === 0) return;
      const next = queue[0];
      setCurrent(next);
      setVisible(true);
      setQueue((prev) => prev.slice(1));

      // Hide after 5 seconds
      setTimeout(() => setVisible(false), 5000);
    };

    // Show first toast after 3 seconds
    const timer = setTimeout(showNext, 3000);
    return () => clearTimeout(timer);
  }, [queue.length]);

  if (!visible || !current) return null;

  return (
    <div className="fixed top-24 left-4 right-4 md:left-auto md:right-4 md:w-[380px] z-50 animate-slide-in">
      <div className="rounded-2xl bg-white border border-purple-100 shadow-2xl p-4 flex items-center gap-3">
        <span className="h-10 w-10 rounded-full bg-[#0E7C3E] text-white grid place-items-center shrink-0">
          <UserPlus className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-[#1A0B2E]">
            {current.name} just registered!
          </div>
          <div className="text-xs text-zinc-500 truncate">
            {current.institution} • {current.timeAgo}
          </div>
        </div>
        <button onClick={() => setVisible(false)} className="text-zinc-400 hover:text-zinc-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
