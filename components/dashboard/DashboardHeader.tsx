"use client";

import { useState, useEffect } from "react";
import { Search, Bell, CheckCircle2, AlertCircle, TrendingUp, LogOut, User, Mail, Key, RefreshCw, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useSidebar } from "./DashboardSidebar";
import Image from "next/image";

export function DashboardHeader() {
  const { data: session } = useSession();
  const { setMobileOpen } = useSidebar();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const fetchNotifications = async () => {
    setLoadingNotifs(true);
    try {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (json.success && json.data?.notifications) {
        setNotifications(json.data.notifications.slice(0, 4));
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    setTimeout(() => fetchNotifications(), 0);
  }, []);

  // Handle global search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("global-search");
        searchInput?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="h-14 sm:h-16 border-b border-white/[0.04] bg-[#0B0F14]/60 backdrop-blur-2xl sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left side: hamburger + search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Mobile hamburger — inside header */}
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors md:hidden shrink-0"
          >
            <Menu className="w-5 h-5 text-white/50" />
          </button>

          {/* Search bar */}
          <div className="relative group flex-1 max-w-xs sm:max-w-sm md:max-w-md hidden sm:block">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              id="global-search"
              placeholder="Search dashboard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-11 pr-12 bg-white/[0.03] border-white/[0.04] focus:border-emerald-500/40 focus:ring-emerald-500/10 transition-all rounded-xl h-9 sm:h-10 text-sm placeholder:text-white/15 w-full"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] font-black text-white/30 group-focus-within:opacity-0 transition-opacity">
              <span className="text-[10px]">⌘</span>K
            </div>
          </div>

          {/* Mobile search icon */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors sm:hidden shrink-0"
          >
            <Search className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {/* Right side: status + bell + profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0">
          {/* Live indicator — desktop only */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/15">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">
              Live
            </span>
          </div>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<button className="p-2 rounded-xl hover:bg-white/[0.04] relative border border-white/[0.04] transition-all active:scale-95 group outline-none" />}>
                <Bell className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0B0F14]" />
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] sm:w-[320px] md:w-[380px] bg-[#12181F] border border-white/10 p-0 overflow-hidden text-white shadow-2xl">
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
                <span className="font-bold text-sm">Notifications</span>
                <button onClick={fetchNotifications} className="text-white/40 hover:text-white transition-colors" disabled={loadingNotifs}>
                  <RefreshCw className={`w-4 h-4 ${loadingNotifs ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="max-h-[260px] sm:max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-white/40 text-sm">No new notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif._id} className="p-3 sm:p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors flex gap-3 cursor-pointer">
                      <div className="shrink-0 mt-0.5">
                        {notif.type === "payment" ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                        ) : notif.type === "order" ? (
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white/90 truncate">{notif.title}</p>
                        <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-white/30 mt-1 font-medium">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link href="/notifications">
                <div className="p-3 text-center text-sm font-bold text-white/50 hover:text-white hover:bg-white/[0.02] transition-colors cursor-pointer border-t border-white/10">
                  View All Notifications
                </div>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-5 sm:h-6 w-px bg-white/[0.04] hidden sm:block" />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<button className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group p-1 md:pr-3 rounded-xl hover:bg-white/[0.04] transition-all outline-none" />}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0 overflow-hidden relative">
                  {session?.user?.avatar ? (
                    <Image src={session.user.avatar} alt={session.user.name || "User"} fill className="object-cover" />
                  ) : (
                    session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "S"
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-black leading-tight tracking-tight text-white/80">
                    {session?.user?.name || "Loading..."}
                  </p>
                  <p className="text-[8px] text-white/20 uppercase tracking-[0.25em] font-black">
                    {((session?.user as unknown) as { role?: string })?.role || "user"}
                  </p>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px] sm:w-[240px] bg-[#12181F] border border-white/10 p-2 text-white shadow-2xl">
              <div className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-lg shrink-0 overflow-hidden relative">
                  {session?.user?.avatar ? (
                    <Image src={session.user.avatar} alt={session.user.name || "User"} fill className="object-cover" />
                  ) : (
                    session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "S"
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm leading-none truncate">{session?.user?.name}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider text-emerald-400 border-emerald-500/30 px-1.5 py-0 bg-emerald-500/10">
                      Pro
                    </Badge>
                    <span className="text-[10px] text-white/40 capitalize">{((session?.user as unknown) as { role?: string })?.role || "user"}</span>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-white/10 my-1" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="py-2.5 px-3 cursor-pointer rounded-lg text-sm text-white/70 focus:bg-white/10 focus:text-white transition-colors" render={<Link href="/profile" />}>
                    <User className="w-4 h-4 mr-3 text-white/40" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 px-3 cursor-pointer rounded-lg text-sm text-white/70 focus:bg-white/10 focus:text-white transition-colors" render={<Link href="/notifications" />}>
                    <Mail className="w-4 h-4 mr-3 text-white/40" />
                    Inbox
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 px-3 cursor-pointer rounded-lg text-sm text-white/70 focus:bg-white/10 focus:text-white transition-colors" render={<Link href="/settings" />}>
                    <Key className="w-4 h-4 mr-3 text-white/40" />
                    Change Password
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-white/10 my-1" />
              <DropdownMenuItem 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="py-2.5 px-3 cursor-pointer hover:bg-rose-500/10 focus:bg-rose-500/10 text-rose-500 rounded-lg text-sm transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search expand */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 p-3 bg-[#0B0F14]/95 backdrop-blur-xl border-b border-white/[0.04] sm:hidden z-50">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/[0.03] border-white/[0.04] focus:border-emerald-500/40 rounded-xl h-10 text-sm placeholder:text-white/15 w-full"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
