"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Crown } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { getPusherClient } from "@/lib/pusher";

export default function LeaderboardPage() {
  const queryClient = useQueryClient();

  const { data: performanceData, isLoading: loading, isError, error } = useQuery({
    queryKey: queryKeys.performance.summary(),
    queryFn: async () => {
      const res = await fetch("/api/analytics/team-performance");
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to fetch");
      return json.data;
    },
    refetchInterval: 300000, // Reduced polling since we have real-time sync
  });

  // Real-time synchronization [rt-sync-effect]
  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe("projects-channel");
    
    channel.bind("project-updated", () => {
      // Invalidate performance data when any project changes
      queryClient.invalidateQueries({ queryKey: queryKeys.performance.all });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [queryClient]);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen mesh-bg text-white">
          <DashboardSidebar />
          <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
            <DashboardHeader />
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent" />
                <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Syncing Performance Data...</p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (isError) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen mesh-bg text-white">
          <DashboardSidebar />
          <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
            <DashboardHeader />
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 p-8 bg-rose-500/10 border border-rose-500/20 rounded-3xl max-w-md text-center">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 mb-2">
                  <Trophy className="w-8 h-8 opacity-20" />
                </div>
                <h2 className="text-xl font-black text-white">Performance Sync Failed</h2>
                <p className="text-sm text-white/40 font-medium">{(error as Error)?.message || "An unexpected error occurred while fetching leaderboard data."}</p>
                <Button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: queryKeys.performance.summary() })}
                  className="mt-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl"
                >
                  Retry Connection
                </Button>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  const data = performanceData;

  const chartData = data?.performance?.map((d: any) => ({
    name: d.name.split(' ')[0], // Use first name for chart
    WIP: d.wip,
    Canceled: d.cancelled,
    Delivered: d.delivered,
    Total: d.totalActive
  })) || [];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-white">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          <DashboardHeader />
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-8">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Badge className="mb-4 bg-amber-500/[0.08] text-amber-400 border-amber-500/20 font-black tracking-[0.2em] uppercase text-[9px]">
                  Team Roster
                </Badge>
                <h1 className="text-4xl sm:text-5xl font-black tracking-[-0.04em]">Elite Force</h1>
                <p className="text-white/30 mt-2 text-sm font-medium">
                  {data?.performance?.length || 0} active members • {data?.totalStars || 0} total stars earned
                </p>
              </motion.div>              {/* Top Performer Spotlight */}
              {data?.topPerformer && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-[2rem] p-5 flex items-center gap-5 shadow-2xl relative overflow-hidden group min-w-[280px]"
                >
                   {/* Animated glow */}
                   <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full group-hover:bg-amber-500/20 transition-all duration-500" />
                   
                    <div className="relative">
                      <Avatar className="w-16 h-16 rounded-2xl border-2 border-amber-500/30 shadow-lg shadow-amber-500/10">
                        <AvatarImage src={data.topPerformer.avatar} alt={data.topPerformer.name} className="object-cover" />
                        <AvatarFallback className="bg-amber-500/10 text-amber-500 font-black text-xl">
                          {getInitials(data.topPerformer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 bg-amber-500 rounded-lg p-1 shadow-lg">
                        <Crown className="w-3 h-3 text-[#0B0F14] fill-current" />
                      </div>
                    </div>
                   <div>
                     <p className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500 mb-1 flex items-center gap-1.5">
                       Top Performer <Crown className="w-2.5 h-2.5" />
                     </p>
                     <h3 className="text-2xl font-black text-white tracking-tight">{data.topPerformer.name}</h3>
                     <p className="text-xs font-bold text-white/40 mt-1">${(data.topPerformer.totalActive || 0).toLocaleString()} Delivered</p>
                   </div>
                </motion.div>
              )}
            </div>

            {/* Performance Grid / Leaderboard */}
            <Card className="bg-[#0B0F14]/90 backdrop-blur-2xl border-white/[0.08] shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                     <tr className="bg-white/[0.02] border-b border-white/[0.05]">
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Developer Name</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-white/30">WIP</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Canceled</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Delivered</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Total Active</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Target</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Need</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-white/30 text-center">Stars</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {data?.performance?.map((member: any) => (
                      <tr key={member._id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 rounded-xl border border-white/10 shrink-0">
                              <AvatarImage src={member.avatar} alt={member.name} className="object-cover" />
                              <AvatarFallback className="bg-emerald-500/10 text-emerald-500 font-black text-xs">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-white group-hover:text-emerald-500 transition-colors">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-bold text-amber-500/80">${(member.wip || 0).toLocaleString()}</td>
                        <td className="px-6 py-5 font-bold text-rose-500/50">${(member.cancelled || 0).toLocaleString()}</td>
                        <td className="px-6 py-5 font-bold text-emerald-500">${(member.delivered || 0).toLocaleString()}</td>
                        <td className="px-6 py-5 font-black text-white">${(member.totalActive || 0).toLocaleString()}</td>
                        <td className="px-6 py-5 font-bold text-white/30">${(member.target || 0).toLocaleString()}</td>
                         <td className="px-6 py-5">
                          <Badge className={`font-black text-[10px] px-3 py-1 rounded-lg border-none ${member.need > 0 ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                            {member.need > 0 ? `-$${(member.need || 0).toLocaleString()}` : `$${Math.abs(member.need || 0).toLocaleString()} Surplus`}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-amber-500 font-black">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{member.stars}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Summary Row */}
                    <tr className="bg-emerald-500/[0.04] font-black border-t border-emerald-500/20">
                      <td className="px-6 py-7 text-emerald-500 uppercase tracking-[0.25em] text-[10px]">Total Aggregate</td>
                      <td className="px-6 py-7 text-emerald-500/80">${(data?.totalWip || 0).toLocaleString()}</td>
                      <td className="px-6 py-7 text-rose-500/60">${(data?.totalCancelled || 0).toLocaleString()}</td>
                      <td className="px-6 py-7 text-emerald-500">${(data?.totalDelivered || 0).toLocaleString()}</td>
                      <td className="px-6 py-7 text-white text-xl">${(data?.totalActiveAll || 0).toLocaleString()}</td>
                      <td className="px-6 py-7 text-white/20">
                        ${data?.performance?.reduce((sum: number, m: any) => sum + m.target, 0).toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-7 text-white/20">
                        <Badge className="bg-white/5 text-white/40 border border-white/10 font-black text-[10px] px-3 py-1 rounded-lg">
                          ${data?.performance?.reduce((sum: number, m: any) => sum + m.need, 0).toLocaleString() || 0} Total Need
                        </Badge>
                      </td>
                      <td className="px-6 py-7 text-amber-500 text-center text-lg">{data?.totalStars}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Visual Analytics Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Stacked Performance Chart */}
              <Card className="lg:col-span-2 bg-[#0B0F14]/90 backdrop-blur-2xl border-white/[0.08] shadow-2xl p-6">
                <div className="mb-8">
                  <h3 className="text-xl font-black text-white">WIP, Canceled, Delivered and Total Active</h3>
                  <p className="text-xs text-white/30 mt-1">Relative performance weightage per developer</p>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      barSize={12}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                      <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={10} fontStyle="bold" />
                      <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.4)" fontSize={11} fontStyle="black" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#12181F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold' }} />
                      <Bar dataKey="WIP" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Canceled" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Delivered" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Total" stackId="a" fill="#ffffff" fillOpacity={0.05} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Performance Distribution */}
              <Card className="bg-[#0B0F14]/90 backdrop-blur-2xl border-white/[0.08] shadow-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-white">Revenue Distribution</h3>
                  <p className="text-xs text-white/30 mt-1">Contribution by each member</p>
                </div>
                <div className="space-y-6 my-8">
                  {data?.performance?.map((member: any) => (
                    <div key={member._id} className="space-y-2">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                        <span className="text-white/60">{member.name}</span>
                        <span className="text-emerald-500">{Math.round((member.totalActive / (data.totalActiveAll || 1)) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(member.totalActive / (data.totalActiveAll || 1)) * 100}%` }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-white/[0.03] border border-white/5 hover:bg-white/10 text-white font-bold rounded-xl py-6">
                  Download Full Report (PDF)
                </Button>
              </Card>
            </div>

          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
