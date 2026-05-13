"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { NumberTicker } from "./NumberTicker";

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ElementType;
  className?: string;
  gradient?: "primary" | "amber" | "rose";
  isLive?: boolean;
}

export function KPICard({
  title,
  value,
  prefix = "",
  suffix = "",
  decimalPlaces = 0,
  description,
  trend,
  icon: Icon,
  className,
  gradient = "primary",
  isLive = false,
}: KPICardProps) {
  return (
    <Card className={cn("glass-card overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl group", className)}>
      <CardContent className="p-4 sm:p-6 relative">
        <div className={cn(
          "absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40",
          gradient === "primary" && "bg-emerald-500",
          gradient === "amber" && "bg-amber-500",
          gradient === "rose" && "bg-rose-500"
        )} />
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {isLive && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              <NumberTicker 
                value={value} 
                prefix={prefix} 
                suffix={suffix} 
                decimalPlaces={decimalPlaces} 
              />
            </h2>
          </div>
          {Icon && (
            <div className={cn(
              "p-3 rounded-xl bg-background/50 border border-border/50 group-hover:scale-110 transition-transform",
              gradient === "primary" && "text-emerald-500",
              gradient === "amber" && "text-amber-500",
              gradient === "rose" && "text-rose-500"
            )}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          )}
        </div>

        {(trend || description) && (
          <div className="mt-4 flex items-center space-x-2">
            {trend && (
              <div className={cn(
                "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                trend.isPositive 
                  ? "text-emerald-500 bg-emerald-500/10" 
                  : "text-rose-500 bg-rose-500/10"
              )}>
                {trend.isPositive ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
                {Math.abs(trend.value)}%
              </div>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

