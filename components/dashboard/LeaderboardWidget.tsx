"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Medal } from "lucide-react";

interface LeaderEntry {
  _id: string;
  name: string;
  performance_score: number;
  total_earnings: number;
  projects_completed: number;
}

export function LeaderboardWidget() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const res = await fetch("/api/users");
        const json = await res.json();
        if (json.success && json.data?.users) {
          const sorted = [...json.data.users]
            .filter((u: any) => u.status === "active")
            .sort((a: any, b: any) => (b.performance_score || 0) - (a.performance_score || 0))
            .slice(0, 5);
          setLeaders(sorted);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchLeaders();
  }, []);

  const medalColors = [
    "from-amber-400 to-amber-600",
    "from-slate-300 to-slate-400",
    "from-orange-400 to-orange-600",
  ];

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-black tracking-tight flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Top Performers</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaders.length === 0 ? (
          <p className="text-white/20 text-sm font-medium text-center py-6">No data yet</p>
        ) : (
          leaders.map((member, index) => (
            <div
              key={member._id}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all group"
            >
              {/* Rank */}
              <div className="shrink-0">
                {index < 3 ? (
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${medalColors[index]} flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-white font-black text-xs">{index + 1}</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <span className="text-white/30 font-black text-xs">{index + 1}</span>
                  </div>
                )}
              </div>

              {/* Avatar + Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white/80 truncate group-hover:text-emerald-500 transition-colors">
                  {member.name}
                </p>
                <p className="text-[10px] text-white/20 font-bold">
                  {member.projects_completed || 0} projects
                </p>
              </div>

              {/* Score */}
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-emerald-500">{member.performance_score || 0}</p>
                <p className="text-[9px] text-white/15 font-bold uppercase tracking-wider">pts</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
