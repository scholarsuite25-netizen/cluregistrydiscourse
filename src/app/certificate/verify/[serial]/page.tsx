export default function VerifyPage({ params }: { params: { serial: string } }) {
  const serial = decodeURIComponent(params.serial);
  return (
    <div className="bg-[#F8F5FF] py-10 min-h-[60vh]">
      <div className="mx-auto max-w-xl px-4">
        <div className="rounded-[24px] bg-white border shadow-xl p-6 text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center mx-auto">✓</div>
          <h1 className="text-xl font-black mt-3">Certificate verification</h1>
          <p className="text-sm text-zinc-600 mt-1">Serial: <b className="tracking-widest font-mono">{serial}</b></p>
          <div className="mt-4 rounded-2xl bg-zinc-50 border p-4 text-sm text-left">
            <p><b>Status:</b> Demo — connect Supabase to verify real certificates.</p>
            <p className="mt-1"><b>Public data only:</b> validity, display name, event, date, serial. Email/phone never exposed.</p>
            <p className="mt-1 text-xs text-zinc-500">Certificates are generated with unique serial + QR verification link after admin bulk generation and attendance approval.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
