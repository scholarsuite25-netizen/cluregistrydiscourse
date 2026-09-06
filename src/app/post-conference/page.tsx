"use client";
import { useState } from "react";
import Link from "next/link";
import { Calendar, Camera, FileText, Megaphone, ExternalLink, Download, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { EVENT } from "@/lib/constants";

export default function PostConferencePage() {
  const [activeTab, setActiveTab] = useState<"reports" | "announcements" | "photos">("reports");

  const reports = [
    { title: "Event Summary Report", desc: "Key highlights, attendance statistics, and outcomes of the Maiden Registry Discourse.", date: "Coming after event", available: false },
    { title: "Keynote Lecture — Full Text", desc: "Complete text of Chief (Mrs.) Mojisola Ladipo's lecture on Governance, Innovation and Service.", date: "Coming after event", available: false },
    { title: "Panel Discussion Minutes", desc: "Summary of the panel discourse on innovation in registry practice and service excellence.", date: "Coming after event", available: false },
    { title: "Recommendations & Action Points", desc: "Key takeaways and agreed action points for university registrars across Nigeria.", date: "Coming after event", available: false },
  ];

  const announcements = [
    { title: "Thank You Messages", desc: "Appreciation to all participants, speakers, and organisers of the Maiden Registry Discourse.", date: "Coming after event" },
    { title: "Certificate Distribution", desc: "How to download your personalised certificate after verified attendance.", date: "Coming after event" },
    { title: "Next Edition预告", desc: "Information about the next Registry Discourse and how to stay involved.", date: "Coming after event" },
  ];

  const photos = [
    { title: "Opening Ceremony", desc: "Arrival, registration, and opening prayers.", count: 0 },
    { title: "Keynote Lecture", desc: "Chief (Mrs.) Mojisola Ladipo delivering the lecture of the day.", count: 0 },
    { title: "Panel Discussion", desc: "Panel of registrars and administrators in discourse.", count: 0 },
    { title: "Group Photographs", desc: "Official group photographs with dignitaries.", count: 0 },
    { title: "Networking & Tea Break", desc: "Participants connecting during the tea break.", count: 0 },
    { title: "Closing Ceremony", desc: "Vote of thanks and closing remarks.", count: 0 },
  ];

  return (
    <div className="bg-[#FFFCF8] py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#4C1769] text-white px-4 py-2 text-sm font-bold">
            <Calendar className="h-4 w-4" /> {EVENT.date} — Post-Event
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-[#1A0B2E]">
            Post-Conference Resources
          </h1>
          <p className="text-base text-zinc-600 mt-2 max-w-2xl mx-auto">
            Reports, announcements, photographs, and materials from the Maiden Registry Discourse.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { id: "reports" as const, label: "Reports & Documents", icon: FileText },
            { id: "announcements" as const, label: "Announcements", icon: Megaphone },
            { id: "photos" as const, label: "Photo Gallery", icon: Camera },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition ${
                activeTab === tab.id
                  ? "bg-[#4C1769] text-white shadow-lg"
                  : "bg-white border border-purple-100 text-[#4C1769] hover:bg-purple-50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            {reports.map((r) => (
              <div key={r.title} className="rounded-[24px] bg-white border border-purple-100 p-6 flex flex-col sm:flex-row items-start gap-4">
                <span className="h-12 w-12 rounded-xl bg-[#4C1769] text-white grid place-items-center shrink-0">
                  <FileText className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#1A0B2E]">{r.title}</h3>
                  <p className="text-sm text-zinc-600 mt-1">{r.desc}</p>
                  <div className="text-xs font-bold text-[#C9B676] mt-2">{r.date}</div>
                </div>
                {r.available ? (
                  <button className="rounded-full bg-[#4C1769] text-white px-5 py-2.5 text-sm font-bold flex items-center gap-2">
                    <Download className="h-4 w-4" /> Download
                  </button>
                ) : (
                  <div className="rounded-full border-2 border-dashed border-zinc-200 text-zinc-500 px-5 py-2.5 text-sm font-bold">
                    Coming soon
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a.title} className="rounded-[24px] bg-white border border-purple-100 p-6">
                <div className="flex items-start gap-4">
                  <span className="h-12 w-12 rounded-xl bg-[#C9B676] text-[#4C1769] grid place-items-center shrink-0">
                    <Megaphone className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-[#1A0B2E]">{a.title}</h3>
                    <p className="text-sm text-zinc-600 mt-1">{a.desc}</p>
                    <div className="text-xs font-bold text-[#C9B676] mt-2">{a.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <div className="space-y-6">
            {/* Google Photos Link */}
            <div className="rounded-[24px] bg-gradient-to-br from-[#4C1769] to-[#6B3A8A] text-white p-6 text-center">
              <Camera className="h-10 w-10 mx-auto text-[#C9B676]" />
              <h3 className="text-xl font-black mt-3">Official Photo Album</h3>
              <p className="text-sm text-white/80 mt-1">High-resolution photographs from the event</p>
              <a
                href="https://photos.google.com"
                target="_blank"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white text-[#4C1769] px-6 py-3 text-sm font-black"
              >
                Open Google Photos <ExternalLink className="h-4 w-4" />
              </a>
              <p className="text-xs text-white/60 mt-2">Link will be updated after the event</p>
            </div>

            {/* Photo Categories */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((p) => (
                <div key={p.title} className="rounded-[24px] bg-white border border-purple-100 overflow-hidden hover:shadow-lg transition">
                  <div className="h-40 bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                    <Camera className="h-10 w-10 text-[#4C1769]/30" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-[#1A0B2E]">{p.title}</h4>
                    <p className="text-xs text-zinc-600 mt-1">{p.desc}</p>
                    <div className="text-xs font-bold text-[#C9B676] mt-2">{p.count} photos</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Info */}
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-center">
              <b>Photos will be uploaded after the event.</b> Check back for the full gallery.
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 rounded-[24px] bg-[#4C1769] text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black">Thank you for being part of history!</h3>
            <p className="text-sm text-white/80 mt-1">The Maiden Registry Discourse was a success because of you.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="rounded-full bg-[#C9B676] text-[#4C1769] px-5 py-2.5 text-sm font-black">Home</Link>
            <Link href="/materials" className="rounded-full bg-white text-[#4C1769] px-5 py-2.5 text-sm font-bold">Materials</Link>
            <Link href="/certificate/verify/demo" className="rounded-full border border-white/20 text-white px-5 py-2.5 text-sm font-bold">Certificate</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
