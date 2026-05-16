"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Shield, Activity as ActivityIcon, User, RefreshCw, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { motion } from "framer-motion";

export default function ActivityLogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect non-admins
  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["admin-activities"],
    queryFn: async () => {
      const res = await fetch("/api/activities?limit=100");
      if (!res.ok) throw new Error("Failed to fetch activities");
      const json = await res.json();
      return json.data?.activities || [];
    },
    enabled: status === "authenticated" && (session?.user as any)?.role === "admin",
  });

  if (status === "loading" || isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen mesh-bg text-white">
          <DashboardSidebar />
          <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
            <DashboardHeader />
            <div className="flex-1 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-white/20 animate-spin" />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-white">
        <DashboardSidebar />
        
        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          {/* Animated background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

          <DashboardHeader />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6 sm:space-y-8 pb-20"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <Badge className="mb-3 bg-rose-500/[0.08] text-rose-400 border-rose-500/20 font-black tracking-[0.2em] uppercase text-[9px] px-3 py-1">
                  Audit Trial
                </Badge>
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-rose-500" />
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.04em] text-white">
                    System Audit Logs
                  </h1>
                </div>
                <p className="text-white/30 mt-2 text-sm sm:text-base font-medium max-w-xl">
                  A permanent ledger of all critical actions taken within the Team Shogun platform.
                </p>
              </div>
              <button
                onClick={() => refetch()}
                disabled={isRefetching}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-sm font-bold text-white/70 hover:text-white transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
                Refresh Ledger
              </button>
            </div>

            {/* Ledger Table */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.05]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-white/[0.02] border-b border-white/[0.05] text-[10px] uppercase font-black text-white/20 tracking-[0.1em]">
                    <tr>
                      <th className="px-6 py-5">Timestamp</th>
                      <th className="px-6 py-5">User</th>
                      <th className="px-6 py-5">Action Taken</th>
                      <th className="px-6 py-5 text-center">Target</th>
                      <th className="px-6 py-5 text-right">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {!data || data.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-white/20">
                          <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                          <p className="font-bold">No activity logs found in the system ledger.</p>
                        </td>
                      </tr>
                    ) : (
                      data.map((log: any) => (
                        <tr key={log._id} className="hover:bg-white/[0.01] transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap text-white/25 font-black text-[10px]">
                            {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center border border-white/[0.06]">
                                <User className="w-3.5 h-3.5 text-white/40" />
                              </div>
                              <span className="font-bold text-white/80 group-hover:text-white transition-colors">{log.userName || "Unknown"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-white/60">{log.action}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {log.target ? (
                              <span className="font-black text-[10px] px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20 text-emerald-400">
                                {log.target}
                              </span>
                            ) : (
                              <span className="text-white/10">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <Badge variant="outline" className={`
                              uppercase tracking-wider text-[9px] font-black rounded-md
                              ${log.type === "project" || log.type === "status" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : ""}
                              ${log.type === "team" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : ""}
                              ${log.type === "system" ? "bg-white/5 text-white/50 border-white/10" : ""}
                            `}>
                              {log.type}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
}
