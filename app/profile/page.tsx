"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User, Camera, Save, Phone, MapPin, Globe, Link2, FileText, Star, Briefcase, TrendingUp, Clock, Plus, X, Image as ImageIcon, CheckCircle2, Award
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";

export default function ProfilePage() {
  const { data: session, status: sessionStatus, update } = useSession();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<"about" | "activity" | "settings">("about");
  const [newSkill, setNewSkill] = useState("");

  // Fetch User Data [qk-include-dependencies]
  const { data: profileData, isLoading: loading } = useQuery({
    queryKey: queryKeys.users.profile(session?.user?.id || ""),
    queryFn: async () => {
      const res = await fetch(`/api/users/${session?.user?.id}`);
      const json = await res.json();
      if (!json.success) throw new Error("Profile not found");
      return json.data.user;
    },
    enabled: !!session?.user?.id,
  });

  // Local state for editing [file-separation]
  const [profile, setProfile] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  // Sync local state when query data loads
  useEffect(() => {
    if (profileData) {
      setTimeout(() => {
        setProfile(profileData);
        setAvatarPreview(profileData.avatar || "");
        setCoverPreview(profileData.coverPhoto || "");
      }, 0);
    }
  }, [profileData]);

  // Mutation for Profile Save [mut-invalidate-queries]
  const saveMutation = useMutation({
    mutationFn: async (updatedProfile: any) => {
      const res = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });
      if (!res.ok) throw new Error("Save failed");
      return updatedProfile;
    },
    onSuccess: () => {
      toast.success("Profile saved successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: () => toast.error("Failed to save profile"),
  });

  // Mutation for Image Upload [mut-loading-states]
  const uploadMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File, type: "avatar" | "cover" }) => {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.message || "Upload failed");
      
      // Auto-save image URL
      await fetch(`/api/users/${session?.user?.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type === "avatar" ? "avatar" : "coverPhoto"]: data.url })
      });
      
      return { url: data.url, type };
    },
    onSuccess: (data) => {
      toast.success(`${data.type === "avatar" ? "Profile" : "Cover"} photo updated!`);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: () => toast.error("Upload failed"),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "avatar") setAvatarPreview(reader.result as string);
      else setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    uploadMutation.mutate({ file, type });
  };

  const addSkill = () => {
    if (!newSkill.trim() || profile?.skills?.includes(newSkill.trim())) return;
    setProfile({ ...profile, skills: [...(profile?.skills || []), newSkill.trim()] });
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((s: string) => s !== skill) });
  };

  const handleSave = async () => {
    saveMutation.mutate({
      name: profile.name, email: profile.email, phone: profile.phone,
      bio: profile.bio, location: profile.location,
      facebook: profile.facebook, linkedin: profile.linkedin, skills: profile.skills,
    });
  };

  const stats = [
    { label: "Projects", value: profile?.projects_completed || 0, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Earnings", value: `$${(profile?.total_earnings || 0).toLocaleString()}`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Score", value: profile?.performance_score || 0, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "On-Time", value: `${profile?.on_time_delivery || 100}%`, icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const uploadingAvatar = uploadMutation.isPending && uploadMutation.variables?.type === "avatar";
  const uploadingCover = uploadMutation.isPending && uploadMutation.variables?.type === "cover";
  const saving = saveMutation.isPending;

  if (loading || sessionStatus === "loading" || !profile) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen mesh-bg text-white">
          <DashboardSidebar />
          <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
            <DashboardHeader />
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent" />
                <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Loading Profile...</p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-white">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[130px] rounded-full -z-10 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />
          <DashboardHeader />
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">
            
            {/* Hero Cover Area */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl overflow-hidden h-48 sm:h-64 lg:h-72 bg-white/[0.02] border border-white/[0.05] group">
              {coverPreview ? (
                <Image src={coverPreview} alt="Cover" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-[#0B0F14] to-blue-900/40" />
              )}
              {uploadingCover && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
                </div>
              )}
              <button
                onClick={() => coverInputRef.current?.click()}
                className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-2 opacity-0 group-hover:opacity-100"
              >
                <ImageIcon className="w-4 h-4" /> Change Cover
              </button>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "cover")} />
            </motion.div>

            {/* Split Grid Layout */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 -mt-16 sm:-mt-24 lg:-mt-28 relative z-10 px-4 sm:px-8">
              
              {/* Left Column: Sticky Profile Card */}
              <div className="lg:w-1/3 shrink-0">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="sticky top-24 space-y-6">
                  <Card className="bg-[#0B0F14]/90 backdrop-blur-2xl border-white/[0.08] shadow-2xl overflow-hidden">
                    <CardContent className="p-6 text-center">
                      <div className="relative inline-block mb-4">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-4 border-[#0B0F14] shadow-xl relative group">
                          {avatarPreview ? (
                            <Image src={avatarPreview} alt="Avatar" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                              <span className="text-4xl font-black text-white/40">{profile.name?.charAt(0).toUpperCase() || "?"}</span>
                            </div>
                          )}
                          {uploadingAvatar && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "avatar")} />
                        
                        {/* Status Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-[#0B0F14] p-1.5 rounded-xl border-4 border-[#0B0F14]">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      </div>

                      <h2 className="text-2xl font-black text-white truncate">{profile.name || "Your Name"}</h2>
                      <p className="text-sm font-bold text-white/40 truncate">{profile.email}</p>
                      
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <Badge className={`font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${profile.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                          {profile.role}
                        </Badge>
                      </div>

                      <div className="mt-6 pt-6 border-t border-white/[0.04] flex justify-center gap-3">
                        {profile.facebook && (
                          <a href={profile.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-blue-500/20 hover:text-blue-500 transition-all">
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                        {profile.linkedin && (
                          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-blue-500/20 hover:text-blue-500 transition-all">
                            <Link2 className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mini Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {stats.map((stat, i) => (
                      <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i*0.05) }} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center">
                        <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                        <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                        <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Content Tabs */}
              <div className="flex-1 mt-8 lg:mt-0 space-y-6 pt-0 lg:pt-28">
                
                {/* Tab Navigation */}
                <div className="flex space-x-2 bg-white/[0.02] p-1.5 rounded-2xl border border-white/[0.04] overflow-x-auto no-scrollbar">
                  {[
                    { id: "about", label: "About", icon: User },
                    { id: "activity", label: "Activity Map", icon: TrendingUp },
                    { id: "settings", label: "Edit Details", icon: Save },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                          isActive ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/80 hover:bg-white/5"
                        }`}
                      >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {/* ABOUT TAB */}
                  {activeTab === "about" && (
                    <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <Card className="bg-white/[0.02] border-white/[0.05]">
                        <CardContent className="p-6 sm:p-8 space-y-6">
                          <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-white/30 mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4" /> Biography
                            </h3>
                            <p className="text-white/70 leading-relaxed font-medium">
                              {profile.bio || "No biography provided yet. Update your details to tell the team about yourself."}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/[0.04]">
                            <div>
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Location</h3>
                              <p className="flex items-center gap-2 text-white/80 font-bold">
                                <MapPin className="w-4 h-4 text-emerald-500" /> {profile.location || "Not specified"}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Phone</h3>
                              <p className="flex items-center gap-2 text-white/80 font-bold">
                                <Phone className="w-4 h-4 text-emerald-500" /> {profile.phone || "Not specified"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Skills Visualizer */}
                      <Card className="bg-white/[0.02] border-white/[0.05]">
                        <CardContent className="p-6 sm:p-8">
                          <h3 className="text-sm font-black uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
                            <Award className="w-4 h-4" /> Professional Skills
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {profile.skills.length === 0 ? (
                              <p className="text-white/30 text-sm font-medium">No skills added yet.</p>
                            ) : (
                              profile.skills.map((skill: string, i: number) => (
                                <div key={skill} className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 text-emerald-400 font-black text-sm shadow-[inset_0_0_20px_rgba(34,197,94,0.05)]">
                                  {skill}
                                </div>
                              ))
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* ACTIVITY MAP TAB */}
                  {activeTab === "activity" && (
                    <motion.div key="activity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <Card className="bg-white/[0.02] border-white/[0.05]">
                        <CardContent className="p-6 sm:p-8 text-center py-20">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-8 h-8 text-emerald-500" />
                          </div>
                          <h3 className="text-xl font-black text-white mb-2">Activity Heatmap</h3>
                          <p className="text-white/40 font-medium max-w-md mx-auto">
                            Visual representation of project contributions over the last 6 months. (Data visualization module initializing...)
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* SETTINGS/EDIT TAB */}
                  {activeTab === "settings" && (
                    <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                      <Card className="bg-white/[0.02] border-white/[0.05]">
                        <CardContent className="p-6 sm:p-8 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Full Name</Label>
                              <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="bg-white/[0.03] border-white/[0.06] rounded-xl h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Location</Label>
                              <Input value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} className="bg-white/[0.03] border-white/[0.06] rounded-xl h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Phone</Label>
                              <Input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="bg-white/[0.03] border-white/[0.06] rounded-xl h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">LinkedIn URL</Label>
                              <Input value={profile.linkedin} onChange={e => setProfile({...profile, linkedin: e.target.value})} className="bg-white/[0.03] border-white/[0.06] rounded-xl h-12" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Biography</Label>
                            <textarea
                              value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})}
                              rows={4} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500/40 resize-none"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Manage Skills</Label>
                            <div className="flex gap-2">
                              <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} placeholder="Add a skill..." className="bg-white/[0.03] border-white/[0.06] rounded-xl h-12 flex-1" />
                              <Button onClick={addSkill} className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl h-12 px-6 font-bold transition-all"><Plus className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                              {profile.skills.map((skill: string) => (
                                <span key={skill} className="flex items-center gap-1.5 text-sm font-bold text-white/60 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 group">
                                  {skill}
                                  <button onClick={() => removeSkill(skill)} className="text-white/20 hover:text-rose-500"><X className="w-3 h-3" /></button>
                                </span>
                              ))}
                            </div>
                          </div>

                          <Button
                            onClick={handleSave} disabled={saving}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl h-12 text-base shadow-lg shadow-emerald-500/20"
                          >
                            <Save className="w-5 h-5 mr-2" /> {saving ? "Saving..." : "Save All Changes"}
                          </Button>

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
