"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell, BellOff, Check, CheckCheck, DollarSign, AlertTriangle, Users, Package, Trash2, Clock, Inbox, MailOpen
} from "lucide-react";
import toast from "react-hot-toast";

const typeIcons: Record<string, any> = {
  order: Package,
  payment: DollarSign,
  revision: AlertTriangle,
  deadline: Clock,
  team: Users,
  system: Bell,
};

const typeColors: Record<string, string> = {
  order: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  payment: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  revision: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  deadline: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  team: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  system: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "system" | "project">("all");

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        const json = await res.json();
        if (json.success && json.data?.notifications) {
          setNotifications(json.data.notifications);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    try {
      await fetch("/api/notifications/mark-all", { method: "PUT" });
      toast.success("All caught up!");
    } catch (e) { toast.error("Failed to mark all as read."); }
  };

  const toggleRead = async (id: string, currentReadStatus: boolean) => {
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: !currentReadStatus } : n));
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentReadStatus })
      });
    } catch (e) { toast.error("Failed to update status."); }
  };

  const deleteNotif = async (id: string) => {
    setNotifications(notifications.filter(n => n._id !== id));
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      toast.success("Notification deleted.");
    } catch (e) { toast.error("Failed to delete."); }
  };

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "system") return n.type === "system" || n.type === "team";
    if (filter === "project") return n.type === "order" || n.type === "revision" || n.type === "deadline";
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const timeAgo = (date: string) => {
    // eslint-disable-next-line react-hooks/purity
    const ms = Date.now() - new Date(date).getTime();
    const hours = Math.floor(ms / 3600000);
    if (hours < 1) {
      const mins = Math.floor(ms / 60000);
      return mins < 1 ? "Just now" : `${mins}m ago`;
    }
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-white">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          <DashboardHeader />
          <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-6">
            
            {/* Header Area */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <Badge className="mb-4 bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20 font-black tracking-[0.2em] uppercase text-[9px]">
                  Operations Center
                </Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em]">Notifications</h1>
                <p className="text-white/30 mt-2 text-sm sm:text-base font-medium">
                  {unreadCount > 0 ? `You have ${unreadCount} unread message${unreadCount > 1 ? "s" : ""}.` : "You are all caught up!"}
                </p>
              </div>
              <Button 
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className={`rounded-xl font-bold px-6 h-11 transition-all shadow-lg ${
                  unreadCount > 0 
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" 
                    : "bg-white/5 text-white/20 hover:bg-white/5 cursor-not-allowed border border-white/[0.05]"
                }`}
              >
                <CheckCheck className="w-4 h-4 mr-2" /> Mark All as Read
              </Button>
            </motion.div>

            {/* Two-Column Layout */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mt-8">
              
              {/* Left Sidebar Filters */}
              <div className="lg:w-64 shrink-0 space-y-2">
                <p className="px-4 text-[9px] uppercase tracking-[0.25em] font-black text-white/20 mb-4">
                  Filters
                </p>
                {[
                  { id: "all", label: "All Messages", icon: Inbox },
                  { id: "unread", label: "Unread", icon: MailOpen, count: unreadCount },
                  { id: "project", label: "Project Updates", icon: Package },
                  { id: "system", label: "System Alerts", icon: Bell },
                ].map((f) => {
                  const isActive = filter === f.id;
                  const Icon = f.icon;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id as any)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-500 shadow-[inset_0_0_20px_rgba(34,197,94,0.05)]"
                          : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                      )}
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-emerald-500" : "group-hover:text-white/70"}`} />
                        <span className="text-sm font-bold tracking-tight">{f.label}</span>
                      </div>
                      {f.count !== undefined && f.count > 0 && (
                        <Badge className={`px-2 py-0 h-5 text-[10px] font-bold rounded-full ${
                          isActive ? "bg-emerald-500 text-white" : "bg-white/10 text-white/50 group-hover:bg-white/20"
                        }`}>
                          {f.count}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Main Feed */}
              <div className="flex-1 space-y-3">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
                  ))
                ) : filtered.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center rounded-3xl bg-white/[0.01] border border-white/[0.03] backdrop-blur-sm"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center mb-6 relative">
                      <BellOff className="w-8 h-8 text-white/20" />
                      <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20" />
                    </div>
                    <h3 className="text-xl font-black text-white/80 mb-2">It&apos;s quiet... too quiet.</h3>
                    <p className="text-white/30 font-medium max-w-sm">
                      You don&apos;t have any notifications in this category. Take a break or check another filter!
                    </p>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {filtered.map((notif: any, index) => {
                      const Icon = typeIcons[notif.type] || Bell;
                      const badgeClasses = typeColors[notif.type] || "bg-white/10 text-white/60 border-white/10";
                      
                      return (
                        <motion.div
                          key={notif._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`group relative flex flex-col sm:flex-row items-start gap-4 p-5 sm:p-6 rounded-2xl border backdrop-blur-sm transition-all overflow-hidden ${
                            notif.read 
                              ? "bg-white/[0.01] border-white/[0.03] hover:bg-white/[0.03]" 
                              : "bg-white/[0.03] border-white/[0.08] shadow-lg shadow-black/20"
                          }`}
                        >
                          {/* Unread Indicator Line */}
                          {!notif.read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                          )}

                          {/* Icon Badge */}
                          <div className={`p-3 rounded-2xl shrink-0 border ${badgeClasses}`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <h3 className={`font-black text-base truncate ${notif.read ? "text-white/70" : "text-white"}`}>
                                {notif.title}
                              </h3>
                              {!notif.read && (
                                <Badge className="h-5 px-1.5 text-[9px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-400 border-none">
                                  New
                                </Badge>
                              )}
                              <span className="text-white/20 text-[10px] font-black uppercase tracking-widest ml-auto mt-1 sm:mt-0">
                                {timeAgo(notif.createdAt)}
                              </span>
                            </div>
                            <p className={`text-sm leading-relaxed ${notif.read ? "text-white/40 font-medium" : "text-white/60 font-medium"}`}>
                              {notif.message}
                            </p>
                          </div>

                          {/* Quick Actions (Hover) */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4 sm:relative sm:top-0 sm:right-0 bg-[#0B0F14]/80 sm:bg-transparent p-1 sm:p-0 rounded-lg backdrop-blur-md sm:backdrop-blur-none">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`rounded-xl h-8 w-8 ${notif.read ? "hover:bg-emerald-500/10 hover:text-emerald-500 text-white/20" : "hover:bg-white/10 text-white/50"}`}
                              onClick={() => toggleRead(notif._id, notif.read)}
                              title={notif.read ? "Mark as unread" : "Mark as read"}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-xl hover:bg-rose-500/10 hover:text-rose-500 text-white/20 h-8 w-8"
                              onClick={() => deleteNotif(notif._id)}
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
