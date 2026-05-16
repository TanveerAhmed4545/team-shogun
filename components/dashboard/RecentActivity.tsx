"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Package, DollarSign, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/SocketProvider";
import { Skeleton } from "@/components/ui/skeleton";

const actionIcons: Record<string, any> = {
  project: Package,
  status: CheckCircle2,
  payment: DollarSign,
  team: Users,
  system: Activity,
};

const actionColors: Record<string, string> = {
  project: "bg-blue-500/10 text-blue-500",
  status: "bg-emerald-500/10 text-emerald-500",
  payment: "bg-amber-500/10 text-amber-500",
  team: "bg-purple-500/10 text-purple-500",
  system: "bg-white/5 text-white/40",
};



function timeAgo(date: string) {
  const ms = Date.now() - new Date(date).getTime();
  const hours = Math.floor(ms / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function RecentActivity() {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  const { data: activities = [], isLoading } = useQuery<any[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      const res = await fetch("/api/activities");
      const json = await res.json();
      if (!json.success) throw new Error("Failed to fetch activities");
      return json.data?.activities || [];
    },
    staleTime: 60000,
  });

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleActivity = () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    };

    socket.on("project-updated", handleActivity);
    socket.on("team-updated", handleActivity);

    return () => {
      socket.off("project-updated", handleActivity);
      socket.off("team-updated", handleActivity);
    };
  }, [queryClient, socket, isConnected]);

  if (isLoading) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-black tracking-tight flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="w-7 h-7 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-black tracking-tight flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = actionIcons[activity.type] || Activity;
            const colorClass = actionColors[activity.type] || actionColors.system;
            return (
              <div key={activity._id} className="flex items-start space-x-3 group">
                <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/60 leading-relaxed">
                    <span className="font-bold text-white/80">{activity.userName}</span>{" "}
                    {activity.action}{" "}
                    {activity.target && (
                      <span className="font-bold text-emerald-500">{activity.target}</span>
                    )}
                  </p>
                  <p className="text-[10px] text-white/15 font-bold mt-0.5">
                    {timeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
