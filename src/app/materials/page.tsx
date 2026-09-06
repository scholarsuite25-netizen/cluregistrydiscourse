import Link from "next/link";
import { Download, BookOpen, FileText, Image } from "lucide-react";

export default function MaterialsPage() {
  const materials = [
    {
      title: "Lecture of the Day — Official PDF",
      desc: "The keynote lecture by Chief (Mrs.) Mojisola Olusola Ladipo, FNIM, mni. Available to all registered participants after the event.",
      icon: FileText,
      status: "Coming after event",
      available: false,
    },
    {
      title: "Event Programme — Printable",
      desc: "Full programme with timeline, speakers, and venue details. Download and print for easy reference.",
      icon: BookOpen,
      status: "Available now",
      available: true,
      link: "/programme",
    },
    {
      title: "Presentation Slides",
      desc: "Slides from keynote and panel sessions. Download after each session.",
      icon: FileText,
      status: "Coming after event",
      available: false,
    },
    {
      title: "Photo Gallery",
      desc: "Official photographs from the event. Download high-resolution images.",
      icon: Image,
      status: "Coming after event",
      available: false,
    },
    {
      title: "Certificate Template",
      desc: "Download your personalised certificate after verified attendance.",
      icon: FileText,
      status: "Available after event",
      available: false,
    },
    {
      title: "Post-Event Report",
      desc: "Summary report with highlights, key takeaways, and recommendations.",
      icon: FileText,
      status: "Coming after event",
      available: false,
    },
  ];

  return (
    <div className="bg-[#F8F5FF] py-8 min-h-[60vh]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A0B2E]">Materials & Resources</h1>
          <p className="text-base text-zinc-600 mt-2 max-w-2xl mx-auto">
            All registered participants have access to event materials. Download your lecture, programme, slides, photos, and certificate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {materials.map((m) => (
            <div key={m.title} className="rounded-[24px] bg-white border border-purple-100 p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <span className="h-10 w-10 rounded-xl bg-[#4C1769] text-white grid place-items-center">
                  <m.icon className="h-5 w-5" />
                </span>
                <div className={`text-xs font-bold tracking-widest px-3 py-1 rounded-full ${m.available ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {m.status}
                </div>
              </div>
              <h3 className="font-bold text-lg text-[#1A0B2E]">{m.title}</h3>
              <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{m.desc}</p>
              {m.available ? (
                <Link href={m.link || "#"} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-5 py-2.5 text-sm font-bold">
                  <Download className="h-4 w-4" /> View / Download
                </Link>
              ) : (
                <div className="mt-4 rounded-full border-2 border-dashed border-zinc-200 text-zinc-500 px-5 py-2.5 text-sm font-bold text-center">
                  Available after event
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[24px] bg-[#4C1769] text-white p-6 text-center">
          <h3 className="text-xl font-black">Need help downloading?</h3>
          <p className="text-sm text-white/80 mt-1">Contact us via WhatsApp or phone for assistance.</p>
          <div className="mt-3 flex justify-center gap-3">
            <a href="https://wa.me/2347038347947?text=Hello%2C%20I%20need%20help%20downloading%20materials" target="_blank" className="rounded-full bg-[#25D366] text-white px-5 py-2.5 text-sm font-bold">WhatsApp</a>
            <a href="tel:+2347038347947" className="rounded-full bg-white text-[#4C1769] px-5 py-2.5 text-sm font-bold">Call</a>
          </div>
        </div>
      </div>
    </div>
  );
}
