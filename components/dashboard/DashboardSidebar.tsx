"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Bell,
  Settings,
  ChevronLeft,
  Menu,
  X,
  UserCircle,
  Target,
  Shield,
  Trophy,
  Activity
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, createContext, useContext } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Briefcase, label: "Projects", href: "/projects" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: UserCircle, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const adminItems = [
  { icon: Target, label: "Revenue Targets", href: "/admin/targets" },
  { icon: Activity, label: "Audit Logs", href: "/admin/logs" },
];

// Context so header can trigger sidebar open
export const SidebarContext = createContext<{
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}>({
  mobileOpen: false,
  setMobileOpen: () => {},
  collapsed: false,
  setCollapsed: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ mobileOpen, setMobileOpen, collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

function NavItem({
  item,
  pathname,
  collapsed,
}: {
  item: { icon: any; label: string; href: string };
  pathname: string;
  collapsed: boolean;
}) {
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative",
        collapsed && "justify-center px-0",
        isActive
          ? "bg-emerald-500/10 text-emerald-500 shadow-[inset_0_0_20px_rgba(34,197,94,0.05)]"
          : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
      )}
      <div className={cn("flex items-center space-x-3", collapsed && "space-x-0")}>
        <item.icon
          className={cn(
            "w-[18px] h-[18px] transition-colors shrink-0",
            isActive ? "text-emerald-500" : "group-hover:text-white/70"
          )}
        />
        {!collapsed && (
          <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
        )}
      </div>
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { mobileOpen, setMobileOpen, collapsed, setCollapsed } = useSidebar();
  const isAdmin = ((session?.user as any)?.role) === "admin";
  const [dbStatus, setDbStatus] = useState<"loading" | "online" | "offline">("loading");

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  // Check DB Health
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        if (res.ok) {
          setDbStatus("online");
          if (data.requiresLogout) {
            signOut({ callbackUrl: "/login?reason=role-change" });
          }
        }
        else setDbStatus("offline");
      } catch {
        setDbStatus("offline");
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <aside
        className={cn(
          "border-r border-white/[0.06] bg-[#0B0F14]/95 backdrop-blur-2xl flex flex-col h-screen sticky top-0 transition-all duration-300 z-50",
          collapsed ? "w-20" : "w-[260px]",
          // Mobile: fixed overlay
          "max-md:fixed max-md:left-0 max-md:top-0 max-md:h-full",
          !mobileOpen && "max-md:-translate-x-full"
        )}
      >
        {/* Header */}
        <div className={cn("p-6 flex items-center", collapsed ? "justify-center" : "justify-between")}>
          <Link href="/" className="flex items-center space-x-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_25px_rgba(34,197,94,0.35)] shrink-0">
              <span className="text-white font-black text-lg italic">S</span>
            </div>
            {!collapsed && (
              <h1 className="text-xl font-black tracking-[-0.05em] bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                SHOGUN
              </h1>
            )}
          </Link>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-all hidden md:flex",
              collapsed && "absolute -right-3 top-8 bg-card border border-white/10 rounded-full shadow-lg"
            )}
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/80 transition-all md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {!collapsed && (
            <p className="px-4 text-[9px] uppercase tracking-[0.25em] font-black text-white/20 mb-3">
              Navigation
            </p>
          )}
          {menuItems.map((item) => (
            <NavItem key={item.label} item={item} pathname={pathname} collapsed={collapsed} />
          ))}

          {/* Admin Section */}
          {isAdmin && (
            <>
              {!collapsed && (
                <div className="pt-4 pb-1">
                  <div className="flex items-center gap-2 px-4">
                    <p className="text-[9px] uppercase tracking-[0.25em] font-black text-amber-500/50">
                      Admin
                    </p>
                    <Shield className="w-3 h-3 text-amber-500/40" />
                  </div>
                </div>
              )}
              {collapsed && <div className="pt-2 border-t border-amber-500/10 mt-2" />}
              {adminItems.map((item) => (
                <NavItem key={item.label} item={item} pathname={pathname} collapsed={collapsed} />
              ))}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className={cn("p-3 border-t border-white/[0.04]", collapsed && "px-2")}>
          {!collapsed && (
            <div className="mb-3 mx-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full animate-pulse",
                  dbStatus === "online" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                  dbStatus === "offline" ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" :
                  "bg-amber-500"
                )} />
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-[0.2em]",
                  dbStatus === "online" ? "text-emerald-500" :
                  dbStatus === "offline" ? "text-rose-500" :
                  "text-amber-500"
                )}>
                  {dbStatus === "online" ? "DB Online" : 
                   dbStatus === "offline" ? "DB Offline" : 
                   "Connecting..."}
                </span>
              </div>
              <span className="text-[9px] text-white/20 font-mono font-bold">v2.0</span>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-white/30 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200",
              collapsed && "justify-center space-x-0"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            {!collapsed && <span className="text-[13px] font-bold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0F14]/90 backdrop-blur-2xl border-t border-white/[0.06] pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-200 relative",
                  isActive ? "text-emerald-500" : "text-white/40 hover:text-white/80"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-xl" />
                )}
                <item.icon className={cn("w-5 h-5 mb-1 z-10", isActive && "drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]")} />
                <span className="text-[9px] font-bold tracking-tight z-10 truncate w-full text-center px-0.5">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
