"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { LayoutDashboard, Users, CalendarCheck, FileText, FolderOpen, MapPin, Award, ArrowLeft, LogOut, ChevronRight } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["super_admin", "content_admin", "checkin_staff"] },
  { href: "/admin/registrations", label: "Registrations", icon: Users, roles: ["super_admin", "content_admin", "checkin_staff"] },
  { href: "/admin/checkin", label: "Check-in", icon: CalendarCheck, roles: ["super_admin", "content_admin", "checkin_staff"] },
  { href: "/admin/programme", label: "Programme", icon: FileText, roles: ["super_admin", "content_admin", "checkin_staff"] },
  { href: "/admin/materials", label: "Materials", icon: FolderOpen, roles: ["super_admin", "content_admin", "checkin_staff"] },
  { href: "/admin/loc", label: "People & LOC", icon: Users, roles: ["super_admin", "content_admin", "checkin_staff"] },
  { href: "/admin/hotels", label: "Hotels", icon: MapPin, roles: ["super_admin", "content_admin", "checkin_staff"] },
  { href: "/admin/certificates", label: "Certificates", icon: Award, roles: ["super_admin", "content_admin", "checkin_staff"] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedRole = sessionStorage.getItem("clu_admin_role");
    const savedEmail = sessionStorage.getItem("clu_admin_email");
    if (savedRole) {
      setRole(savedRole);
      setEmail(savedEmail);
    }
    setChecking(false);
  }, []);

  // Login page has its own auth — skip check for /admin root
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  // Not logged in — redirect to admin login
  if (!checking && !role) {
    router.replace("/admin");
    return null;
  }

  function handleLogout() {
    sessionStorage.removeItem("clu_admin_role");
    sessionStorage.removeItem("clu_admin_id");
    sessionStorage.removeItem("clu_admin_email");
    if (isSupabaseConfigured) {
      getSupabase()?.auth.signOut();
    }
    router.replace("/admin");
  }

  const visibleNav = NAV_ITEMS.filter((item) => !role || item.roles.includes(role));
  const currentPage = NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(item.href + "/"));

  return (
    <div className="bg-[#F8F5FF] min-h-screen">
      {/* Top bar */}
      <div className="bg-[#1A0B2E] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10"
          >
            <div className="space-y-1">
              <div className="w-5 h-0.5 bg-white"></div>
              <div className="w-5 h-0.5 bg-white"></div>
              <div className="w-5 h-0.5 bg-white"></div>
            </div>
          </button>
          <Link href="/admin" className="text-sm font-black tracking-wider">CLU ADMIN</Link>
          {currentPage && currentPage.href !== "/admin" && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-white/50">
              <ChevronRight className="h-3 w-3" />
              <span className="text-white/80">{currentPage.label}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/60 hidden sm:inline">{email}</span>
          <span className="rounded-full bg-emerald-400 text-[#1A0B2E] px-2 py-0.5 text-[10px] font-black uppercase">{role?.replace("_", " ")}</span>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-56 bg-white border-r border-purple-100 min-h-[calc(100vh-48px)] p-4">
          <nav className="space-y-1">
            {visibleNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    active
                      ? "bg-[#4C1769] text-white"
                      : "text-zinc-600 hover:bg-purple-50 hover:text-[#4C1769]"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Sidebar — mobile overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-black text-[#1A0B2E]">Navigation</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-500">
                  ✕
                </button>
              </div>
              <nav className="space-y-1">
                {visibleNav.map((item) => {
                  const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                        active
                          ? "bg-[#4C1769] text-white"
                          : "text-zinc-600 hover:bg-purple-50 hover:text-[#4C1769]"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
