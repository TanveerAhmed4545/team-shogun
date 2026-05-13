"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Target,
  Save,
  Shield,
  DollarSign,
  Users,
  TrendingUp,
  Check,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  total_earnings: number;
  projects_completed: number;
  preferences: {
    monthlyTarget: number;
  };
}

export default function RevenueTargetsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const userRole = ((session?.user as any)?.role) || "member";
  const isAdmin = userRole === "admin";

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedTargets, setEditedTargets] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);

  useEffect(() => {
    if (session && !isAdmin) {
      router.push("/");
      toast.error("Admin access only");
    }
  }, [session, isAdmin, router]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (data.users) {
          setMembers(data.users);
          // Initialize edited targets with current values
          const targets: Record<string, number> = {};
          data.users.forEach((m: TeamMember) => {
            targets[m._id] = m.preferences?.monthlyTarget || 10000;
          });
          setEditedTargets(targets);
        }
      } catch (e) {
        console.error("Failed to fetch members:", e);
      } finally {
        setLoading(false);
      }
    }
    if (isAdmin) fetchMembers();
  }, [isAdmin]);

  const handleSaveOne = async (memberId: string) => {
    setSavingId(memberId);
    try {
      const res = await fetch(`/api/users/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: {
            ...members.find((m) => m._id === memberId)?.preferences,
            monthlyTarget: editedTargets[memberId],
          },
        }),
      });
      if (res.ok) {
        toast.success("Target updated");
        setMembers((prev) =>
          prev.map((m) =>
            m._id === memberId
              ? { ...m, preferences: { ...m.preferences, monthlyTarget: editedTargets[memberId] } }
              : m
          )
        );
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSavingId(null);
    }
  };

  const handleApplyToAll = async (targetValue: number) => {
    setSavingAll(true);
    let successCount = 0;
    for (const member of members) {
      try {
        const res = await fetch(`/api/users/${member._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            preferences: {
              ...member.preferences,
              monthlyTarget: targetValue,
            },
          }),
        });
        if (res.ok) successCount++;
      } catch {
        // continue
      }
    }
    // Update local state
    const updatedTargets: Record<string, number> = {};
    const updatedMembers = members.map((m) => {
      updatedTargets[m._id] = targetValue;
      return { ...m, preferences: { ...m.preferences, monthlyTarget: targetValue } };
    });
    setMembers(updatedMembers);
    setEditedTargets(updatedTargets);
    toast.success(`Updated ${successCount} of ${members.length} members`);
    setSavingAll(false);
  };

  const totalTarget = Object.values(editedTargets).reduce((sum, v) => sum + v, 0);
  const totalEarnings = members.reduce((sum, m) => sum + (m.total_earnings || 0), 0);

  const roleColors: Record<string, string> = {
    admin: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    moderator: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    member: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  if (!isAdmin) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-white">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          <DashboardHeader />
          <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-amber-500/[0.08] text-amber-400 border-amber-500/20 font-black tracking-[0.2em] uppercase text-[9px]">
                  Admin
                </Badge>
                <Badge className="bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20 font-black tracking-[0.2em] uppercase text-[9px]">
                  <Shield className="w-3 h-3 mr-1" /> Protected
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.04em]">
                Revenue Targets
              </h1>
              <p className="text-white/30 mt-1 text-sm sm:text-base font-medium">
                Set monthly revenue goals for each team member
              </p>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Card className="bg-white/[0.02] border-emerald-500/10 overflow-hidden group hover:bg-white/[0.04] transition-all">
                  <CardContent className="p-4 sm:p-5">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 w-fit mb-3">
                      <Target className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20 mb-1">
                      Team Target
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-500 truncate">
                      ${totalTarget.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-white/20 mt-1">per month combined</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-white/[0.02] border-blue-500/10 overflow-hidden group hover:bg-white/[0.04] transition-all">
                  <CardContent className="p-4 sm:p-5">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-blue-500/10 w-fit mb-3">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20 mb-1">
                      Total Earnings
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-blue-500 truncate">
                      ${totalEarnings.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-white/20 mt-1">all-time revenue</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="col-span-2 lg:col-span-1">
                <Card className="bg-white/[0.02] border-amber-500/10 overflow-hidden group hover:bg-white/[0.04] transition-all">
                  <CardContent className="p-4 sm:p-5">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 w-fit mb-3">
                      <Users className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20 mb-1">
                      Team Size
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-amber-500 truncate">
                      {members.length}
                    </p>
                    <p className="text-[10px] text-white/20 mt-1">active members</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Action: Apply same target to all */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/[0.02] border-white/[0.05] overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white/80">Apply Same Target to All</p>
                      <p className="text-[11px] text-white/25 font-medium mt-0.5">
                        Set one target for the entire team at once
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                        <Input
                          id="bulk-target"
                          type="number"
                          defaultValue={10000}
                          className="bg-white/[0.03] border-white/[0.06] rounded-xl h-10 pl-8 w-full sm:w-32"
                        />
                      </div>
                      <Button
                        disabled={savingAll}
                        onClick={() => {
                          const input = document.getElementById("bulk-target") as HTMLInputElement;
                          const value = Number(input?.value || 10000);
                          handleApplyToAll(value);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-10 px-5 shrink-0"
                      >
                        {savingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Member Targets List */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card className="bg-white/[0.02] border-white/[0.05] overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10">
                      <Target className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-black">Individual Targets</CardTitle>
                      <p className="text-[11px] text-white/20 font-medium">
                        Set a specific monthly target for each member
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 p-3 sm:p-6 pt-0 sm:pt-0">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                    </div>
                  ) : members.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-10 h-10 text-white/10 mx-auto mb-3" />
                      <p className="text-white/20 font-bold">No team members found</p>
                    </div>
                  ) : (
                    members.map((member, i) => {
                      const currentTarget = editedTargets[member._id] || 0;
                      const originalTarget = member.preferences?.monthlyTarget || 10000;
                      const hasChanged = currentTarget !== originalTarget;
                      const progress = originalTarget > 0
                        ? Math.min(100, (member.total_earnings / originalTarget) * 100)
                        : 0;

                      return (
                        <motion.div
                          key={member._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.02 * i }}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.03] transition-all"
                        >
                          {/* Avatar + Info */}
                          <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center text-white font-black text-sm border border-white/[0.06] shrink-0 overflow-hidden">
                              {member.avatar ? (
                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                member.name?.charAt(0).toUpperCase() || "?"
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-sm text-white/80 truncate">{member.name}</p>
                                <Badge
                                  variant="outline"
                                  className={`${roleColors[member.role] || ""} font-bold text-[8px] uppercase tracking-wider px-1.5 py-0 rounded-full`}
                                >
                                  {member.role}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] text-white/25 font-medium truncate">{member.email}</span>
                                <span className="text-[10px] text-emerald-500/60 font-bold hidden sm:inline">
                                  {member.projects_completed} projects
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Progress bar - compact */}
                          <div className="w-full sm:w-24 shrink-0 hidden md:block">
                            <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-500 transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="text-[9px] text-white/20 font-bold mt-1 text-center">
                              {progress.toFixed(0)}% reached
                            </p>
                          </div>

                          {/* Target Input + Save */}
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                              <Input
                                type="number"
                                value={currentTarget}
                                onChange={(e) =>
                                  setEditedTargets({
                                    ...editedTargets,
                                    [member._id]: Number(e.target.value),
                                  })
                                }
                                className="bg-white/[0.03] border-white/[0.06] rounded-xl h-10 pl-8 w-full sm:w-28 text-sm font-bold"
                              />
                            </div>
                            <Button
                              size="sm"
                              disabled={!hasChanged || savingId === member._id}
                              onClick={() => handleSaveOne(member._id)}
                              className={`rounded-xl h-10 px-3 font-bold shrink-0 transition-all ${
                                hasChanged
                                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                  : "bg-white/5 text-white/20 cursor-not-allowed"
                              }`}
                            >
                              {savingId === member._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : hasChanged ? (
                                <Save className="w-4 h-4" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
