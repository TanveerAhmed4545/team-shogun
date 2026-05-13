"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Access Requested</h2>
          <p className="text-white/50 font-medium leading-relaxed mb-8">
            Your registration is pending admin approval. You&apos;ll be notified once your account is activated.
          </p>
          <Link href="/login">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl px-8 h-12 shadow-xl shadow-emerald-500/10">
              Back to Login
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-blue-500/8 blur-[120px] rounded-full" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
              <span className="text-white font-black text-2xl italic">S</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">SHOGUN</h1>
          </div>
          <p className="text-white/40 font-medium">Request access to the operations center</p>
        </div>

        <div className="glass-card rounded-3xl p-10 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-rose-400 text-sm font-bold text-center">
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">Full Name</Label>
              <Input placeholder="Your name" className="bg-white/5 border-white/5 focus:border-emerald-500/50 rounded-xl h-12 text-white placeholder:text-white/20" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">Email Address</Label>
              <Input type="email" placeholder="you@shogun.dev" className="bg-white/5 border-white/5 focus:border-emerald-500/50 rounded-xl h-12 text-white placeholder:text-white/20" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" className="bg-white/5 border-white/5 focus:border-emerald-500/50 rounded-xl h-12 text-white pr-12 placeholder:text-white/20" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">Confirm Password</Label>
              <Input type="password" placeholder="Repeat password" className="bg-white/5 border-white/5 focus:border-emerald-500/50 rounded-xl h-12 text-white placeholder:text-white/20" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black h-12 rounded-xl shadow-xl shadow-emerald-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Access"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-white/30 text-sm font-medium">
              Already have access?{" "}
              <Link href="/login" className="text-emerald-500 font-black hover:text-emerald-400 transition-colors">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
