export default function AdminMaterials(){
  return <div className="mx-auto max-w-6xl px-4 py-6"><h1 className="text-xl font-black">Materials Library</h1><p className="text-sm text-zinc-600">Private Supabase Storage bucket • short-lived signed URLs • file allow-list PDF/DOCX/PPTX/images • eligibility + release time • download tracking</p><div className="mt-4 rounded-2xl border-2 border-dashed p-8 text-center bg-white">Drop files here (admin uploads are trusted but validated) — max 25MB • checksum optional</div></div>;
}
