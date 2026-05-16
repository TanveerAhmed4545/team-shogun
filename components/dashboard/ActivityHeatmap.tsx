"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format, subDays, eachDayOfInterval, isSameDay } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ActivityHeatmapProps {
  userId: string;
}

export function ActivityHeatmap({ userId }: ActivityHeatmapProps) {
  const { data: activityMap = {}, isLoading } = useQuery<Record<string, number>>({
    queryKey: ["user-activity", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/activity`);
      const json = await res.json();
      return json.success ? json.data : {};
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Crunching data...</p>
      </div>
    );
  }

  // Generate days for the last 6 months (approx 26 weeks)
  const endDate = new Date();
  const startDate = subDays(endDate, 180); // ~6 months
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Group days by week (columns)
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  allDays.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || isSameDay(day, endDate)) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getIntensity = (count: number) => {
    if (!count) return "bg-white/[0.03] border-white/[0.02]";
    if (count < 3) return "bg-emerald-500/20 border-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
    if (count < 6) return "bg-emerald-500/40 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
    if (count < 10) return "bg-emerald-500/70 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]";
    return "bg-emerald-500 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)]";
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            Activity Distribution
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </h3>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
            Contribution heatmap based on daily engagement
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 bg-white/[0.02] p-2 rounded-xl border border-white/[0.05]">
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Less</span>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-[4px] bg-white/[0.03] border border-white/[0.02]" />
            <div className="w-3 h-3 rounded-[4px] bg-emerald-500/20 border border-emerald-500/10" />
            <div className="w-3 h-3 rounded-[4px] bg-emerald-500/40 border border-emerald-500/20" />
            <div className="w-3 h-3 rounded-[4px] bg-emerald-500/70 border border-emerald-500/30" />
            <div className="w-3 h-3 rounded-[4px] bg-emerald-500 border border-emerald-400" />
          </div>
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">More</span>
        </div>
      </div>

      <TooltipProvider delayDuration={0}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-2 shrink-0">
              {week.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const count = activityMap[dateStr] || 0;
                return (
                  <Tooltip key={dateStr}>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (weekIndex * 0.01) + (day.getDay() * 0.005) }}
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-[4px] sm:rounded-md border transition-all hover:scale-125 hover:z-10 cursor-pointer ${getIntensity(count)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#0B0F14] border-white/10 text-white p-3 rounded-xl shadow-2xl backdrop-blur-xl">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{format(day, "MMMM d, yyyy")}</p>
                        <p className="text-sm font-bold">{count} {count === 1 ? 'activity' : 'activities'}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </TooltipProvider>

      {/* Summary Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.04]">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Total Activities</p>
          <p className="text-xl font-black text-emerald-500">
            {Object.values(activityMap).reduce((a: number, b: any) => a + (Number(b) || 0), 0)}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Daily Average</p>
          <p className="text-xl font-black text-blue-500">
            {(Object.values(activityMap).reduce((a: number, b: any) => a + (Number(b) || 0), 0) / 180).toFixed(1)}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Peak Intensity</p>
          <p className="text-xl font-black text-amber-500">
            {Math.max(...(Object.values(activityMap).map(v => Number(v) || 0)), 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
