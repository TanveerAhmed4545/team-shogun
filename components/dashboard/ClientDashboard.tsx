"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { ExportButton } from "@/components/dashboard/ExportButton";
import dynamic from "next/dynamic";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ProjectTable } from "@/components/dashboard/ProjectTable";
import { LeaderboardWidget } from "@/components/dashboard/LeaderboardWidget";
import {
  DollarSign,
  Briefcase,
  CheckCircle2,
  XCircle,
  ArrowUpIcon,
  ArrowDownIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectModal } from "@/components/dashboard/ProjectModal";
import { useAnalytics } from "@/hooks/useAnalytics";
import { NumberTicker } from "@/components/dashboard/NumberTicker";

// Dynamic imports with minimal loading skeletons to prevent layout shift
const RevenueChart = dynamic(
  () => import("@/components/dashboard/RevenueChart").then((mod) => mod.RevenueChart),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
  }
);
const ProjectStatusChart = dynamic(
  () => import("@/components/dashboard/ProjectStatusChart").then((mod) => mod.ProjectStatusChart),
  { 
    ssr: false,
    loading: () => <div className="h-[300px] w-full rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
  }
);

export function ClientDashboard() {
  const queryClient = useQueryClient();
  const { data: statsData, isLoading: loading } = useAnalytics();

  const stats = statsData || {
    revenue: 0,
    activeOrders: 0,
    totalProjects: 0,
    totalMembers: 0,
    completionRate: 0,
    cancelledRate: 0,
  };

  const handleProjectCreated = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-12 lg:space-y-16 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge className="mb-4 bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20 font-black tracking-[0.2em] uppercase text-[9px] px-3 py-1">
            Command Center
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white">
            Welcome back, <span className="text-emerald-500">Shogun.</span>
          </h1>
          <p className="text-white/40 mt-3 text-sm sm:text-base font-medium">
            Real-time performance orchestration for your agency operations.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ExportButton />
          <div className="flex-1 sm:flex-none">
            <ProjectModal onSuccess={handleProjectCreated} />
          </div>
        </div>
      </div>

      {/* Premium Glassmorphic KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-4">
        
        {/* Primary Metric - Total Revenue */}
        <div className="lg:col-span-2 relative group overflow-hidden rounded-[2rem] bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.05] p-8 sm:p-10 hover:border-white/[0.1] transition-all duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.15),transparent_50%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">Total Revenue</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center backdrop-blur-md">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-5xl sm:text-6xl lg:text-[5rem] leading-none font-black tracking-tighter text-white tabular-nums drop-shadow-sm">
                <NumberTicker value={stats.revenue} prefix="$" />
              </h2>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mt-4 bg-emerald-500/10 w-fit px-3 py-1.5 rounded-full border border-emerald-500/20">
                <ArrowUpIcon className="w-4 h-4" /> 12.5% vs last month
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metric - Active Orders */}
        <div className="relative group overflow-hidden rounded-[2rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05] p-6 sm:p-8 hover:border-white/[0.1] transition-all duration-500 flex flex-col justify-between min-h-[200px]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_50%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6">
              <Briefcase className="w-5 h-5 text-white/70" />
            </div>
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
              Active Orders
            </span>
            <div className="text-4xl font-black tracking-tighter text-white tabular-nums">
              <NumberTicker value={stats.activeOrders} />
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mt-3">
              <ArrowUpIcon className="w-3.5 h-3.5" /> 8 in pipeline
            </div>
          </div>
        </div>

        {/* Secondary Metric - Success Rate */}
        <div className="relative group overflow-hidden rounded-[2rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05] p-6 sm:p-8 hover:border-white/[0.1] transition-all duration-500 flex flex-col justify-between min-h-[200px]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.1),transparent_50%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
              Success Rate
            </span>
            <div className="text-4xl font-black tracking-tighter text-white tabular-nums">
              <NumberTicker value={stats.completionRate} suffix="%" decimalPlaces={1} />
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mt-3">
              <ArrowUpIcon className="w-3.5 h-3.5" /> 2.1% target
            </div>
          </div>
        </div>

        {/* Secondary Metric - Cancelled */}
        <div className="relative group overflow-hidden rounded-[2rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05] p-6 sm:p-8 hover:border-white/[0.1] transition-all duration-500 flex flex-col justify-between min-h-[200px]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(244,63,94,0.08),transparent_50%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/[0.05] border border-rose-500/10 flex items-center justify-center mb-6">
              <XCircle className="w-5 h-5 text-rose-500" />
            </div>
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
              Cancelled
            </span>
            <div className="text-4xl font-black tracking-tighter text-white tabular-nums">
              <NumberTicker value={stats.cancelledRate} suffix="%" decimalPlaces={1} />
            </div>
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold mt-3">
              <ArrowDownIcon className="w-3.5 h-3.5" /> 0.5% rate
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 space-y-8">
          <ProjectTable />
          <RevenueChart />
        </div>

        <div className="lg:col-span-4 space-y-8">
          <ProjectStatusChart />
          <LeaderboardWidget />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
