"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTeamPerformance } from "@/hooks/useTeamPerformance";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Star, Target, DollarSign, Package, CheckCircle2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

export default function MemberProfilePage() {
  const { id } = useParams();
  const { data, isLoading, refetch } = useTeamPerformance();
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const member = data?.find((m: any) => String(m._id) === String(id));

  useEffect(() => {
    if (!id) return;
    
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const res = await fetch(`/api/projects?developer=${id}`);
        const json = await res.json();
        if (json.success) {
          setProjects(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading || !data || data.length === 0) {
    return (
      <div className="flex h-screen bg-[#0B0F14] text-white overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1600px] mx-auto space-y-6">
              <Skeleton className="h-32 w-full rounded-2xl bg-white/[0.02]" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-24 w-full rounded-2xl bg-white/[0.02]" />
                <Skeleton className="h-24 w-full rounded-2xl bg-white/[0.02]" />
                <Skeleton className="h-24 w-full rounded-2xl bg-white/[0.02]" />
              </div>
              <Skeleton className="h-64 w-full rounded-2xl bg-white/[0.02]" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex h-screen bg-[#0B0F14] text-white overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white/40 text-lg font-bold">Member not found</p>
              <Link href="/team" className="text-emerald-500 hover:text-emerald-400 text-sm mt-2 inline-block font-bold">
                Back to Team
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Mock data for chart (scaled to real delivered value)
  const chartData = [
    { month: "Jan", earnings: Math.round((member.delivered || 0) * 0.5) },
    { month: "Feb", earnings: Math.round((member.delivered || 0) * 0.7) },
    { month: "Mar", earnings: Math.round((member.delivered || 0) * 0.6) },
    { month: "Apr", earnings: Math.round((member.delivered || 0) * 0.9) },
    { month: "May", earnings: Math.round(member.delivered || 0) },
  ];

  return (
    <div className="flex h-screen bg-[#0B0F14] text-white overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            
            {/* Header / Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl border border-white/[0.04] p-6 flex flex-col md:flex-row items-center gap-6"
            >
              <div className="relative">
                <Avatar className="w-24 h-24 rounded-2xl border-2 border-white/[0.06] group-hover:border-emerald-500/30 transition-colors">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 text-3xl font-black">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {member.stars > 0 && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 rounded-lg p-1.5 shadow-lg">
                    <Crown className="w-4 h-4 text-[#0B0F14] fill-current" />
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-3xl font-black text-white tracking-tight">{member.name}</h1>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Badge className="bg-white/[0.04] text-white/60 border-white/[0.05] capitalize">
                      {member.role}
                    </Badge>
                    {member.stars > 0 && (
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> {member.stars} Stars
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-white/40 text-sm mt-1 font-medium">{member.email}</p>
                
                <div className="flex flex-wrap gap-1.5 mt-3 justify-center md:justify-start">
                  {member.skills?.map((skill: string) => (
                    <span key={skill} className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.03] text-white/40 border border-white/[0.05]">
                      {skill}
                    </span>
                  )) || (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.03] text-white/20 border border-white/[0.05]">
                      No skills listed
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => refetch()}
                  className="p-2.5 rounded-xl border border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-white/40" />
                </button>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <Card className="bg-white/[0.02] border-white/[0.05] p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Total Delivered</p>
                    <p className="text-2xl font-black text-white mt-1">${(member.delivered || 0).toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/[0.02] border-white/[0.05] p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Work In Progress</p>
                    <p className="text-2xl font-black text-white mt-1">${(member.wip || 0).toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/[0.02] border-white/[0.05] p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Projects Completed</p>
                    <p className="text-2xl font-black text-white mt-1">{member.completedCount}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </Card>
              
              <Card className="bg-white/[0.02] border-white/[0.05] p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Monthly Target</p>
                    <p className="text-2xl font-black text-white mt-1">${(member.preferences?.monthlyTarget || 1100).toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart */}
              <Card className="lg:col-span-2 bg-white/[0.02] border-white/[0.05] p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-sm font-black uppercase tracking-wider text-white/70">Earnings Performance</CardTitle>
                </CardHeader>
                <div className="h-[250px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff/0.02" vertical={false} />
                      <XAxis dataKey="month" stroke="#ffffff/10" tick={{ fill: '#ffffff/30', fontSize: 10 }} />
                      <YAxis stroke="#ffffff/10" tick={{ fill: '#ffffff/30', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#12181F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        labelStyle={{ color: 'white', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              {/* Additional Info */}
              <Card className="bg-white/[0.02] border-white/[0.05] p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-sm font-black uppercase tracking-wider text-white/70">Member Status</CardTitle>
                </CardHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                    <span className="text-xs text-white/40">Account Score</span>
                    <span className="text-sm font-bold text-white">{member.score || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                    <span className="text-xs text-white/40">Role</span>
                    <span className="text-sm font-bold text-white capitalize">{member.role}</span>
                  </div>

                </div>
              </Card>
            </div>

            {/* Projects Section */}
            <Card className="bg-white/[0.02] border-white/[0.05] p-6">
              <CardHeader className="px-0 pt-0 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-black uppercase tracking-wider text-white/70">Assigned Projects</CardTitle>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{projects.length} Total</Badge>
              </CardHeader>
              
              {loadingProjects ? (
                <div className="space-y-3 mt-4">
                  <Skeleton className="h-12 w-full bg-white/[0.02]" />
                  <Skeleton className="h-12 w-full bg-white/[0.02]" />
                  <Skeleton className="h-12 w-full bg-white/[0.02]" />
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-white/20 text-sm font-bold">
                  No projects assigned to this member yet.
                </div>
              ) : (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-sm text-left text-white/70">
                    <thead className="text-[10px] font-black uppercase tracking-wider text-white/30 border-b border-white/[0.05]">
                      <tr>
                        <th className="pb-3 px-2">Order ID</th>
                        <th className="pb-3 px-2">Client</th>
                        <th className="pb-3 px-2">Status</th>
                        <th className="pb-3 px-2">Value</th>
                        <th className="pb-3 px-2">Deadline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                      {projects.map((project) => (
                        <tr key={project._id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-3 px-2 font-mono text-xs text-white/90">{project.orderId}</td>
                          <td className="py-3 px-2 font-bold text-white/80">{project.clientName}</td>
                          <td className="py-3 px-2">
                            <Badge className={`text-[10px] uppercase tracking-wider ${
                              project.orderStatus === "Delivered" || project.orderStatus === "Completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                              project.orderStatus === "WIP" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                              project.orderStatus === "Revision" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                              "bg-white/5 text-white/40 border-white/10"
                            }`}>
                              {project.orderStatus}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 font-black text-white/90">${(project.value || 0).toLocaleString()}</td>
                          <td className="py-3 px-2 text-white/40 text-xs">
                            {project.deadline ? new Date(project.deadline).toLocaleDateString() : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}
