"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import { getTimeLeft, autoPriority } from "@/lib/utils/project";

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  WIP: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Revision: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  Delivered: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Cancelled: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const priorityColors: Record<string, string> = {
  Green: "bg-emerald-500",
  Yellow: "bg-amber-500",
  Red: "bg-rose-500",
};

// Using centralized utilities from @/lib/utils/project

const statusFlow = ["Pending", "WIP", "Revision", "Delivered", "Completed"];

export function ProjectTable({ refreshTrigger }: { refreshTrigger?: number }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const json = await res.json();
        if (json.success && json.data) {
          setProjects(json.data.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [refreshTrigger]);

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    // Optimistic update
    setProjects((prev) =>
      prev.map((p) =>
        p._id === projectId ? { ...p, orderStatus: newStatus } : p
      )
    );

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        toast.success(`Status → ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-black tracking-tight">
          Active Projects
        </CardTitle>
        <Link href="/projects">
          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 text-xs font-bold"
          >
            View All
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.04] hover:bg-transparent">
              <TableHead className="pl-6 text-[9px] uppercase tracking-[0.2em] font-black text-white/20">
                Client
              </TableHead>
              <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20">
                Status
              </TableHead>
              <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20">
                Value
              </TableHead>
              <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20">
                Time Left
              </TableHead>
              <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20">
                Priority
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-white/20"
                >
                  No active projects found.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project: any) => {
                const timeLeft = getTimeLeft(project.deadline, project.orderStatus);
                const s = project.orderStatus?.toLowerCase();
                const priority = (s === "completed" || s === "delivered") ? "Green" : autoPriority(project.deadline);
                return (
                  <TableRow
                    key={project._id}
                    className="border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                  >
                    <TableCell className="pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-white/80 group-hover:text-emerald-500 transition-colors">
                          {project.clientName}
                        </span>
                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                          {project.orderId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          const currentIndex = statusFlow.indexOf(
                            project.orderStatus
                          );
                          if (
                            currentIndex >= 0 &&
                            currentIndex < statusFlow.length - 1
                          ) {
                            handleStatusChange(
                              project._id,
                              statusFlow[currentIndex + 1]
                            );
                          }
                        }}
                        className="cursor-pointer"
                        title="Click to advance status"
                      >
                        <Badge
                          variant="outline"
                          className={`${
                            statusStyles[project.orderStatus] || ""
                          } font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full hover:opacity-80 transition-opacity`}
                        >
                          {project.orderStatus}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-bold text-emerald-500 text-sm">
                        ${project.value}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1.5">
                        <Clock className={`w-3 h-3 ${timeLeft.color}`} />
                        <span
                          className={`text-xs font-bold ${timeLeft.color}`}
                        >
                          {timeLeft.text}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            priorityColors[priority]
                          }`}
                        />
                        <span className="text-[10px] font-bold text-white/30 uppercase">
                          {priority}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
