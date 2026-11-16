"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  TrendingUp,
  User as UserIcon,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { queryKeys } from "@/lib/queries/keys";
import { getTimeLeft } from "@/lib/utils/project";
import toast from "react-hot-toast";

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  WIP: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Revision: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  Delivered: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Cancelled: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

export default function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isAdmin = session?.user?.role === "admin";

  // Fetch Member Details
  const {
    data: member,
    isLoading: loadingMember,
    isError,
  } = useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error("Member not found");
      const json = await res.json();
      return json.data.user;
    },
    enabled: !!id,
  });

  // Fetch Member's Projects
  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ["projects", "developer", id],
    queryFn: async () => {
      const res = await fetch(`/api/projects?developer=${id}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    },
    enabled: !!id,
  });

  // Admin Role/Status Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData: { role?: string; status?: string }) => {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update member");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Member updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: () => {
      toast.error("Failed to update member settings");
    },
  });

  if (loadingMember) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent" />
          <p className="text-white/40 font-bold text-xs uppercase tracking-widest">
            Loading operative record...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] p-4">
        <div className="text-center max-w-md p-8 bg-card/60 border border-border/10 rounded-2xl">
          <h2 className="text-xl font-black text-foreground mb-2">Member Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            The requested operative profile could not be retrieved or has been removed.
          </p>
          <Link href="/team">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Return to Roster
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full space-y-8 animate-in fade-in duration-500">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Team Roster
        </Link>
        {isAdmin && (
          <div className="flex items-center gap-3">
            <Select
              value={member.role}
              onValueChange={(newRole) => updateMutation.mutate({ role: newRole })}
            >
              <SelectTrigger className="h-8 text-xs bg-accent/5 border-border/10 w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={member.status}
              onValueChange={(newStatus) => updateMutation.mutate({ status: newStatus })}
            >
              <SelectTrigger className="h-8 text-xs bg-accent/5 border-border/10 w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Profile Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/30 bg-black/40 shrink-0">
            {member.avatar ? (
              <Image
                src={member.avatar}
                alt={member.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30 text-3xl font-black">
                {member.name?.slice(0, 2).toUpperCase() || "OP"}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {member.name}
              </h1>
              <Badge
                variant="outline"
                className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                  member.role === "admin"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    : member.role === "moderator"
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}
              >
                {member.role}
              </Badge>
              <Badge
                variant="outline"
                className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                  member.status === "active"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
              >
                {member.status}
              </Badge>
            </div>

            {member.bio && (
              <p className="text-white/60 text-sm mt-2 max-w-2xl leading-relaxed">
                {member.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs text-white/40">
              {member.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{member.email}</span>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{member.phone}</span>
                </div>
              )}
              {member.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{member.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Tag Strip */}
        {member.skills && member.skills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/[0.05]">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mr-2">
              Capabilities:
            </span>
            {member.skills.map((skill: string) => (
              <span
                key={skill}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/70"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-card/60 border border-border/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground/40 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Total Earnings
            </span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">
            ${(member.total_earnings || 0).toLocaleString()}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card/60 border border-border/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground/40 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Completed Orders
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">
            {member.projects_completed || 0}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card/60 border border-border/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground/40 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest">
              On-Time Delivery
            </span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">
            {member.on_time_delivery || 100}%
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card/60 border border-border/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground/40 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Performance Score
            </span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">
            {member.performance_score || 0}
          </p>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="rounded-2xl border border-border/10 bg-card/40 p-6 backdrop-blur-xl">
        <h2 className="text-sm font-black uppercase tracking-wider text-foreground mb-4">
          6-Month Activity Heatmap
        </h2>
        <ActivityHeatmap userId={id} />
      </div>

      {/* Assigned Projects */}
      <div className="rounded-2xl border border-border/10 bg-card/40 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
            Assigned Projects ({projects.length})
          </h2>
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="text-xs font-bold text-emerald-400">
              Manage Orders →
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No projects currently assigned to this operative.
          </p>
        ) : (
          <div className="divide-y divide-border/10">
            {projects.map((p: any) => {
              const timeLeft = getTimeLeft(p.deadline, p.orderStatus);
              return (
                <div
                  key={p._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-accent/5 px-3 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">
                        {p.clientName}
                      </span>
                      <span className="text-[10px] uppercase font-mono text-muted-foreground/60">
                        {p.orderId}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Value: <span className="text-emerald-400 font-bold">${p.value}</span> · Deadline: {new Date(p.deadline).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${timeLeft.color}`}>
                      {timeLeft.text}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        statusStyles[p.orderStatus] || ""
                      }`}
                    >
                      {p.orderStatus}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
