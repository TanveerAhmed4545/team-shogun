"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ProjectTable } from "@/components/dashboard/ProjectTable";
import { LeaderboardWidget } from "@/components/dashboard/LeaderboardWidget";
import {
  DollarSign,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Search,
  Bell,
  Plus,
  ArrowRight,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProjectModal } from "@/components/dashboard/ProjectModal";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Link from "next/link";

import { useSession } from "next-auth/react";

const RevenueChart = dynamic(
  () =>
    import("@/components/dashboard/RevenueChart").then(
      (mod) => mod.RevenueChart
    ),
  { ssr: false }
);
const ProjectStatusChart = dynamic(
  () =>
    import("@/components/dashboard/ProjectStatusChart").then(
      (mod) => mod.ProjectStatusChart
    ),
  { ssr: false }
);

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    revenue: 0,
    activeOrders: 0,
    totalProjects: 0,
    totalMembers: 0,
    completionRate: 0,
    cancelledRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProjectCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    fetchAnalytics();
  };

  async function fetchAnalytics() {
    try {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      if (res.ok) {
        setStats({
          revenue: data.revenue || 0,
          activeOrders: data.activeOrders || 0,
          totalProjects: data.totalProjects || 0,
          totalMembers: data.totalMembers || 0,
          completionRate: data.completionRate || 0,
          cancelledRate: data.cancelledRate || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-white selection:bg-emerald-500/30">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          {/* Animated background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />

          <DashboardHeader />

          {/* Dashboard Content */}
          <motion.div
            className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Welcome Section */}
            <motion.div
              className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6"
              variants={itemVariants}
            >
              <div>
                <Badge className="mb-3 bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20 font-black tracking-[0.2em] uppercase text-[9px] px-3 py-1">
                  Command Center
                </Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.04em] text-white">
                  Welcome back, <span className="text-emerald-500">Shogun.</span>
                </h1>
                <p className="text-white/30 mt-2 text-sm sm:text-base font-medium">
                  Real-time performance orchestration for your Fiverr agency
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link href="/finance" className="flex-1 sm:flex-none">
                  <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md text-sm font-bold hover:bg-white/[0.06] transition-all text-white/50 hover:text-white/80">
                    Export Data
                  </button>
                </Link>
                <div className="flex-1 sm:flex-none">
                  <ProjectModal onSuccess={handleProjectCreated} />
                </div>
              </div>
            </motion.div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              <motion.div variants={itemVariants}>
                <KPICard
                  title="Total Revenue"
                  value={stats.revenue}
                  prefix="$"
                  trend={stats.revenue > 0 ? { value: 12.5, isPositive: true } : undefined}
                  description="vs last month"
                  icon={DollarSign}
                  gradient="primary"
                  isLive
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <KPICard
                  title="Active Orders"
                  value={stats.activeOrders}
                  trend={stats.activeOrders > 0 ? { value: 8, isPositive: true } : undefined}
                  description="in pipeline"
                  icon={Briefcase}
                  gradient="amber"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <KPICard
                  title="Success Rate"
                  value={stats.completionRate}
                  suffix="%"
                  decimalPlaces={1}
                  trend={stats.completionRate > 0 ? { value: 2.1, isPositive: true } : undefined}
                  description="above target"
                  icon={CheckCircle2}
                  gradient="primary"
                  isLive
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <KPICard
                  title="Cancelled"
                  value={stats.cancelledRate}
                  suffix="%"
                  decimalPlaces={1}
                  trend={stats.cancelledRate > 0 ? { value: 0.5, isPositive: false } : undefined}
                  description="cancellation rate"
                  icon={XCircle}
                  gradient="rose"
                />
              </motion.div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              <motion.div
                className="lg:col-span-8 space-y-4 sm:space-y-6"
                variants={itemVariants}
              >
                <ProjectTable refreshTrigger={refreshTrigger} />
                <RevenueChart />
              </motion.div>

              <motion.div
                className="lg:col-span-4 space-y-4 sm:space-y-6"
                variants={itemVariants}
              >
                <ProjectStatusChart />
                <LeaderboardWidget />
                <RecentActivity />
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
}
