"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Mail,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  MoreHorizontal,
  Star,
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

export default function TeamPage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPending, setShowPending] = useState(false);
  
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (data.users) {
          setMembers(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch team:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    setMembers((prev) =>
      prev.map((m) => (m._id === userId ? { ...m, status: newStatus } : m))
    );
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) toast.success(`Member ${newStatus}`);
      else toast.error("Failed to update");
    } catch {
      toast.error("Network error");
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    setMembers((prev) =>
      prev.map((m) => (m._id === userId ? { ...m, role: newRole } : m))
    );
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) toast.success(`Role → ${newRole}`);
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Remove this team member?")) return;
    setMembers((prev) => prev.filter((m) => m._id !== userId));
    try {
      await fetch(`/api/users/${userId}`, { method: "DELETE" });
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const activeMembers = members.filter((m) => m.status === "active");
  const pendingMembers = members.filter((m) => m.status === "pending");

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
                  Elite Force
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
                  <div
                    key={i}
                    className="h-64 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse"
                  />
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
                    <Card className="bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] transition-all group overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-30 transition-opacity" />
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-5">
                          <Avatar className="w-16 h-16 rounded-2xl border-2 border-white/[0.06] group-hover:border-emerald-500/30 transition-colors">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 text-xl font-black">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {isAdmin && session?.user?.id !== member._id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <button className="rounded-xl hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 flex items-center justify-center">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>
                                }
                              />
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

                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-black text-white/90 group-hover:text-emerald-500 transition-colors">
                              {member.name}
                            </h3>
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

                          <div className="flex flex-wrap gap-1.5">
                            {(member.skills || []).slice(0, 3).map((skill: string) => (
                              <span
                                key={skill}
                                className="text-[10px] font-bold text-white/30 bg-white/[0.03] px-2 py-0.5 rounded-md"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-white/[0.04] grid grid-cols-3 gap-3">
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
