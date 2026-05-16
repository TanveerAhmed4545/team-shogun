"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Shield,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { useUsers, useUpdateUser, useDeleteUser } from "@/hooks/useUsers";
import { useTeamPerformance } from "@/hooks/useTeamPerformance";
import Swal from "sweetalert2";

export default function TeamPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showPending, setShowPending] = useState(false);
  
  const isAdmin = session?.user?.role === "admin";

  // Modularized Hooks [hook-abstraction]
  const { data: members = [], isLoading: loadingUsers } = useUsers();
  const { data: performance = [], isLoading: loadingPerformance } = useTeamPerformance();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const loading = loadingUsers || loadingPerformance;

  const handleStatusUpdate = (userId: string, newStatus: string) => {
    updateMutation.mutate({ userId, data: { status: newStatus } });
  };

  const handleRoleUpdate = (userId: string, newRole: string) => {
    updateMutation.mutate({ userId, data: { role: newRole } });
  };

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: "Remove Member?",
      text: "This action will permanently delete this member from the agency. This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981", // emerald-500
      cancelButtonColor: "#f43f5e", // rose-500
      confirmButtonText: "Yes, remove them!",
      cancelButtonText: "Cancel",
      background: "#0B0F14",
      color: "#fff",
      customClass: {
        popup: "border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl",
        title: "font-black tracking-tight",
        htmlContainer: "text-white/60 font-medium",
        confirmButton: "rounded-xl font-bold px-6",
        cancelButton: "rounded-xl font-bold px-6",
      },
    });

    if (result.isConfirmed) {
      try {
        await toast.promise(deleteMutation.mutateAsync(userId), {
          loading: "Removing member...",
          success: "Member removed successfully",
          error: "Failed to remove member",
        });
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const activeMembers = (Array.isArray(members) ? members : [])
    .filter((m) => m.status === "active")
    .map((member) => {
      const perf = Array.isArray(performance) ? performance.find((p: any) => p._id === member._id) : null;
      return {
        ...member,
        performance_score: perf ? Math.round(perf.totalActive / 10) : 0,
        total_earnings: perf ? perf.delivered : 0,
        projects_completed: perf ? perf.completedCount : 0
      };
    });
    
  const pendingMembers = (Array.isArray(members) ? members : []).filter((m) => m.status === "pending");

  const roleColors: Record<string, string> = {
    admin: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    moderator: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    member: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <SidebarProvider>
    <div className="flex min-h-screen mesh-bg text-white">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
        <DashboardHeader />
        <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-3 bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20 font-black tracking-[0.2em] uppercase text-[9px]">
              Team Roster
            </Badge>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.04em]">
                  Team Shogun
                </h1>
                <p className="text-white/30 mt-1 font-medium">
                  {activeMembers.length} active · {pendingMembers.length}{" "}
                  pending approval
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {isAdmin && pendingMembers.length > 0 && (
                  <Button
                    variant="outline"
                    className={`rounded-xl border-white/[0.06] font-bold ${
                      showPending
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-white/[0.03] text-white/50"
                    }`}
                    onClick={() => setShowPending(!showPending)}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Pending ({pendingMembers.length})
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Pending Approval Queue */}
          {isAdmin && (
            <AnimatePresence>
              {showPending && pendingMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-amber-500/20 bg-amber-500/[0.03]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-black flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-amber-500" />
                      <span>Awaiting Approval</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {pendingMembers.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10 rounded-xl border border-white/10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-white/5 text-sm font-black">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-sm text-white/80">
                              {member.name}
                            </p>
                            <p className="text-[10px] text-white/30 font-bold">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-8 text-xs"
                            onClick={() =>
                              handleStatusUpdate(member._id, "active")
                            }
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-rose-500/20 text-rose-500 hover:bg-rose-500/10 font-bold rounded-xl h-8 text-xs"
                            onClick={() => handleDelete(member._id)}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="bg-white/[0.02] border-white/[0.05] p-6 h-64 space-y-4">
                    <div className="flex justify-between items-start">
                      <Skeleton className="w-16 h-16 rounded-2xl" />
                      <Skeleton className="h-8 w-8 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-12 rounded-md" />
                      <Skeleton className="h-4 w-12 rounded-md" />
                    </div>
                    <div className="pt-4 border-t border-white/[0.04] grid grid-cols-3 gap-3">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </Card>
                ))
              : activeMembers.length === 0
              ? (
                <div className="col-span-full py-16 text-center glass-card rounded-2xl border border-white/[0.04]">
                  <Users className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/20 font-bold">
                    No active team members yet.
                  </p>
                </div>
              )
              : activeMembers.map((member: any, index: number) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] transition-all group overflow-hidden relative h-full flex flex-col">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-30 transition-opacity" />
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-5">
                          <Link href={`/team/${member._id}`}>
                            <Avatar className="w-16 h-16 rounded-2xl border-2 border-white/[0.06] hover:border-emerald-500/30 transition-colors cursor-pointer">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 text-xl font-black">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                          {isAdmin && session?.user?.id !== member._id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger className="rounded-xl hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 flex items-center justify-center">
                                <MoreHorizontal className="w-4 h-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-[#12181F] border-white/10 text-white">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRoleUpdate(member._id, "admin")
                                  }
                                >
                                  Make Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRoleUpdate(member._id, "moderator")
                                  }
                                >
                                  Make Moderator
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRoleUpdate(member._id, "member")
                                  }
                                >
                                  Make Member
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(member._id, "suspended")
                                  }
                                  className="text-rose-500 focus:text-rose-500"
                                >
                                  Suspend
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(member._id)}
                                  className="text-rose-500 focus:text-rose-500"
                                >
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>

                        <div className="space-y-4 flex-1 flex flex-col">
                          <div>
                            <Link href={`/team/${member._id}`}>
                              <h3 className="text-lg font-black text-white/90 hover:text-emerald-500 transition-colors cursor-pointer">
                                {member.name}
                              </h3>
                            </Link>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                variant="outline"
                                className={`${
                                  roleColors[member.role] || ""
                                } font-bold text-[9px] uppercase tracking-wider px-2 py-0 rounded-full`}
                              >
                                {member.role}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 min-h-[22px]">
                            {member.skills && member.skills.length > 0 ? (
                              member.skills.slice(0, 3).map((skill: string) => (
                                <span
                                  key={skill}
                                  className="text-[10px] font-bold text-white/30 bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/5"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] font-bold text-white/10 italic">No skills listed</span>
                            )}
                          </div>

                          <div className="mt-auto pt-4 border-t border-white/[0.04] grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-[9px] text-white/15 font-black uppercase tracking-wider">
                                Score
                              </p>
                              <p className="text-sm font-black text-emerald-500">
                                {member.performance_score || 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] text-white/15 font-black uppercase tracking-wider">
                                Earnings
                              </p>
                              <p className="text-sm font-black text-white/60">
                                ${(member.total_earnings || 0).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] text-white/15 font-black uppercase tracking-wider">
                                Projects
                              </p>
                              <p className="text-sm font-black text-white/60">
                                {member.projects_completed || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </div>
        </div>
      </main>
    </div>
    </SidebarProvider>
  );
}
