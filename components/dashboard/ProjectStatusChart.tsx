"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function ProjectStatusChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDistribution() {
      try {
        const res = await fetch("/api/analytics");
        const analytics = await res.json();
        if (analytics.statusDistribution && analytics.statusDistribution.length > 0) {
          setData(analytics.statusDistribution);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchDistribution();
  }, []);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-black tracking-tight">
          Project Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
                itemStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-black text-white">{total}</p>
              <p className="text-[9px] text-white/20 font-black uppercase tracking-wider">
                Total
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] text-white/30 font-bold truncate">
                {item.name}
              </span>
              <span className="text-[10px] text-white/15 font-bold ml-auto">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
