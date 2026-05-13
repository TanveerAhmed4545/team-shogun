"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Package, DollarSign, Users, AlertTriangle, CheckCircle2 } from "lucide-react";

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
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch("/api/activities");
        const data = await res.json();
        if (data.activities) {
          setActivities(data.activities);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    }
    fetchActivities();
  }, []);

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
