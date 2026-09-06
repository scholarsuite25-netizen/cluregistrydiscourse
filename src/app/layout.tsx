import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PwaRegister } from "@/components/PwaRegister";
import { RegistrationToast } from "@/components/home/RegistrationToast";
import { EVENT } from "@/lib/constants";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "CLU Registry Discourse 2026 — Governance, Innovation & Service",
    template: "%s | CLU Registry Discourse",
  },
  description: `Maiden Registry Discourse of Chrisland University, Abeokuta — ${EVENT.fullTitle}. ${EVENT.date}, ${EVENT.venue}. Physical & Online via Zoom.`,
  manifest: "/manifest.json",
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  openGraph: {
    title: "CLU Registry Discourse 2026",
    description: EVENT.fullTitle,
    type: "website",
  },
  metadataBase: new URL("https://cluregistrydiscourse.vercel.app"),
};

export const viewport: Viewport = {
  themeColor: "#4C1769",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <PwaRegister />
        <RegistrationToast />
        {/* floating actions */}
        <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 md:hidden">
          <a href={EVENT.phoneHref} className="h-12 w-12 rounded-full bg-[#4C1769] text-white grid place-items-center shadow-xl">📞</a>
          <a href={`${EVENT.whatsappHref}?text=${encodeURIComponent(EVENT.whatsappPrefill)}`} target="_blank" className="h-12 w-12 rounded-full bg-[#25D366] text-white grid place-items-center shadow-xl">💬</a>
        </div>
      </body>
    </html>
  );
}
