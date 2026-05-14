"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bell, Save, ShieldCheck, Key, MonitorSmartphone, AlertTriangle, LogOut
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";

export default function SettingsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"preferences" | "security" | "sessions">("preferences");

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    deadlineAlerts: true,
  });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  // Fetch User Preferences [qk-hierarchical-organization]
  const { data: userData } = useQuery({
    queryKey: queryKeys.users.profile(session?.user?.id || ""),
    queryFn: async () => {
      const res = await fetch(`/api/users/${session?.user?.id}`);
      const json = await res.json();
      return json.data.user;
    },
    enabled: !!session?.user?.id,
  });

  // Sync preferences local state
  useEffect(() => {
    if (userData?.preferences) {
      setTimeout(() => setPreferences(userData.preferences), 0);
    }
  }, [userData]);

  // Mutation for Preferences [mut-invalidate-queries]
  const prefMutation = useMutation({
    mutationFn: async (newPrefs: any) => {
      const res = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: newPrefs }),
      });
      if (!res.ok) throw new Error("Failed to save");
      return newPrefs;
    },
    onSuccess: () => {
      toast.success("Preferences updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: () => toast.error("Failed to save preferences"),
  });

  // Mutation for Password Change [mut-error-handling]
  const passwordMutation = useMutation({
    mutationFn: async (pwdData: any) => {
      const res = await fetch(`/api/users/${session?.user?.id}/password`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pwdData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      return data;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      setPasswords({ current: "", newPass: "", confirm: "" });
    },
    onError: (error: any) => toast.error(error.message),
  });

  const handleSavePreferences = () => {
    prefMutation.mutate(preferences);
  };

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.newPass) return toast.error("All fields are required");
    if (passwords.newPass !== passwords.confirm) return toast.error("Passwords do not match");
    if (passwords.newPass.length < 6) return toast.error("Password must be at least 6 characters");
    
    passwordMutation.mutate({ currentPassword: passwords.current, newPassword: passwords.newPass });
  };

  // Password strength visualizer (Basic)
  const getStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 33;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 33;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score += 34;
    return score;
  };
  const strength = getStrength(passwords.newPass);

  const tabs = [
    { id: "preferences", label: "Preferences", icon: Bell },
    { id: "security", label: "Security & Access", icon: ShieldCheck },
    { id: "sessions", label: "Active Sessions", icon: MonitorSmartphone },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-white">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          <DashboardHeader />
          <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-8">
            
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="mb-4 bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20 font-black tracking-[0.2em] uppercase text-[9px]">
                Configuration
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em]">Settings</h1>
              <p className="text-white/30 mt-2 text-sm sm:text-base font-medium">
                Manage your account settings, security, and notifications.
              </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Vertical Sidebar */}
              <div className="lg:w-64 shrink-0 space-y-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? "bg-white/10 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] font-bold" 
                          : "text-white/40 hover:bg-white/[0.04] hover:text-white/80 font-medium"
                      }`}
                    >
                      <tab.icon className={`w-4 h-4 ${isActive ? "text-emerald-500" : ""}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Content Area */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  
                  {/* PREFERENCES TAB */}
                  {activeTab === "preferences" && (
                    <motion.div key="preferences" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <Card className="bg-[#0B0F14]/90 backdrop-blur-2xl border-white/[0.08] shadow-2xl">
                        <CardContent className="p-6 sm:p-8 space-y-6">
                          <div>
                            <h2 className="text-xl font-black text-white">Notification Alerts</h2>
                            <p className="text-sm text-white/40 mt-1">Choose what updates you want to receive.</p>
                          </div>
                          
                          <div className="space-y-3">
                            {[
                              { label: "Email Notifications", key: "emailNotifications", desc: "Receive daily summaries and critical alerts via email." },
                              { label: "Deadline Alerts", key: "deadlineAlerts", desc: "Get warned 24h before a project deadline expires." },
                            ].map((item) => {
                              const isEnabled = preferences[item.key as keyof typeof preferences];
                              return (
                                <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                                  <div className="pr-4">
                                    <p className="text-base font-bold text-white/90">{item.label}</p>
                                    <p className="text-xs text-white/40 mt-1 leading-relaxed">{item.desc}</p>
                                  </div>
                                  <button
                                    onClick={() => setPreferences({ ...preferences, [item.key]: !isEnabled })}
                                    className={`relative w-12 h-7 rounded-full transition-colors duration-300 shrink-0 ${isEnabled ? "bg-emerald-500" : "bg-white/10"}`}
                                  >
                                    <div className={`absolute top-[3px] left-[3px] w-5.5 h-5.5 rounded-full bg-white shadow-md transition-transform duration-300 ${isEnabled ? "translate-x-5" : "translate-x-0"}`} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>

                          <div className="pt-6 border-t border-white/[0.04]">
                            <Button onClick={handleSavePreferences} disabled={prefMutation.isPending} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-emerald-500/20">
                              <Save className="w-4 h-4 mr-2" /> {prefMutation.isPending ? "Saving..." : "Save Preferences"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* SECURITY TAB */}
                  {activeTab === "security" && (
                    <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <Card className="bg-[#0B0F14]/90 backdrop-blur-2xl border-white/[0.08] shadow-2xl">
                        <CardContent className="p-6 sm:p-8 space-y-6">
                          <div>
                            <h2 className="text-xl font-black text-white flex items-center gap-2"><Key className="w-5 h-5 text-emerald-500" /> Change Password</h2>
                            <p className="text-sm text-white/40 mt-1">Ensure your account is using a long, random password to stay secure.</p>
                          </div>

                          <div className="space-y-4 max-w-md">
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Current Password</Label>
                              <Input type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="bg-white/[0.03] border-white/[0.06] rounded-xl h-12" />
                            </div>
                            
                            <div className="pt-4 border-t border-white/[0.04] space-y-2">
                              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">New Password</Label>
                              <Input type="password" value={passwords.newPass} onChange={e => setPasswords({...passwords, newPass: e.target.value})} className="bg-white/[0.03] border-white/[0.06] rounded-xl h-12" />
                              
                              {/* Strength Meter */}
                              {passwords.newPass && (
                                <div className="pt-2">
                                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                                    <div className={`h-full transition-all duration-500 ${strength < 50 ? 'bg-rose-500 w-1/3' : strength < 100 ? 'bg-amber-500 w-2/3' : 'bg-emerald-500 w-full'}`} />
                                  </div>
                                  <p className="text-[10px] font-bold text-white/30 mt-1 text-right">
                                    {strength < 50 ? 'Weak' : strength < 100 ? 'Good' : 'Strong'}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Confirm New Password</Label>
                              <Input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="bg-white/[0.03] border-white/[0.06] rounded-xl h-12" />
                            </div>

                            <Button onClick={handlePasswordChange} disabled={passwordMutation.isPending} className="bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl h-11 w-full mt-4">
                              {passwordMutation.isPending ? "Updating Securely..." : "Update Password"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Danger Zone */}
                      <Card className="bg-rose-500/[0.02] border-rose-500/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-black text-rose-500 flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5" /> Danger Zone
                            </h2>
                            <p className="text-sm text-white/40 mt-1 max-w-sm leading-relaxed">
                              Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                          </div>
                          <Button variant="destructive" className="bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl font-bold shrink-0">
                            Delete Account
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* SESSIONS TAB (Stub) */}
                  {activeTab === "sessions" && (
                    <motion.div key="sessions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <Card className="bg-[#0B0F14]/90 backdrop-blur-2xl border-white/[0.08] shadow-2xl">
                        <CardContent className="p-6 sm:p-8 space-y-6">
                          <div>
                            <h2 className="text-xl font-black text-white">Active Sessions</h2>
                            <p className="text-sm text-white/40 mt-1">Manage the devices that are currently logged into your account.</p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/20">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                                  <MonitorSmartphone className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="font-bold text-white flex items-center gap-2">Windows PC <Badge className="bg-emerald-500/20 text-emerald-400 border-none h-5 px-1.5 text-[9px]">Current</Badge></p>
                                  <p className="text-xs text-white/40 mt-0.5">Dhaka, Bangladesh • Active now</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-xl text-white/40">
                                  <MonitorSmartphone className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="font-bold text-white/80">iPhone 14 Pro Max</p>
                                  <p className="text-xs text-white/40 mt-0.5">Dhaka, Bangladesh • Last seen 2 hours ago</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs font-bold">
                                <LogOut className="w-3 h-3 mr-1.5" /> Revoke
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
