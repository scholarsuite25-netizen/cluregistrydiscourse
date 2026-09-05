export default function MaterialsPage() {
  return (
    <div className="bg-[#F8F5FF] py-8 min-h-[60vh]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-black">Materials</h1>
        <p className="text-sm text-zinc-600 mt-1">Protected listing — signed URLs after server authorisation. Eligibility: all_registered, attended_only, online, physical, or selected group.</p>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { title: "Lecture of the Day — Official PDF", status: "Attended only • Not yet released", desc: "Uploaded and released by admin after verification. Notified via email/push (+ WhatsApp if configured)." },
            { title: "Event Programme — Printable", status: "All registered • Release: on publish", desc: "Generated from currently published programme or uploaded as approved official PDF." },
            { title: "Photo Gallery & Resources", status: "Coming after event", desc: "Images, presentations and approved resources (PDF, DOCX, PPTX) — private bucket, signed downloads." },
          ].map((m) => (
            <div key={m.title} className="rounded-[24px] bg-white border p-5">
              <div className="text-xs font-bold tracking-widest text-[#C9B676]">{m.status}</div>
              <h3 className="font-bold mt-1">{m.title}</h3>
              <p className="text-sm text-zinc-600 mt-2">{m.desc}</p>
              <button disabled className="mt-4 w-full rounded-full border py-2.5 text-sm font-bold disabled:opacity-50">Locked — sign in to view</button>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm">
          <b>Access control:</b> Materials are stored in a private Supabase Storage bucket. Downloads use short-lived signed URLs after server-side authorisation. No private bucket is made public.
        </div>
      </div>
    </div>
  );
}
