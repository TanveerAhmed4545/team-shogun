"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Image from "next/image";

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
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <Image src="/samurai-bg.png" alt="Background" fill className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center max-w-md bg-black/80 p-10 rounded-none border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Access Requested</h2>
          <p className="text-white/60 font-medium leading-relaxed mb-8">
            Your registration is pending admin approval. You will be notified once your account is activated.
          </p>
          <Link href="/login">
            <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-none h-12 transition-all uppercase tracking-widest">
              Return to Login
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Background Cinematic Image */}
      <Image 
        src="/samurai-bg.png" 
        alt="Samurai Background" 
        fill 
        className="object-cover object-center opacity-40 scale-105"
        priority
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_80%)]" />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center p-4">
        
        {/* Back Link */}
        <div className="absolute top-8 left-8">
          <Link href="/" className="group flex items-center gap-2 text-white/50 hover:text-emerald-400 transition-colors text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Shogun
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo & Title */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative w-[280px] h-[160px] border border-white/20 rounded-xl overflow-hidden mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Image src="/shogun-logo2.png" alt="Shogun Logo" fill className="object-cover object-center" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-wider uppercase" style={{ fontFamily: "var(--font-permanent-marker), cursive", textShadow: "0 0 40px rgba(16,185,129,0.4)" }}>
              Join the Ranks
            </h1>
            <p className="text-emerald-500/80 text-xs tracking-[0.3em] uppercase mt-4 font-bold">
              Secure Operations Access
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/50 p-4 text-red-500 text-xs font-bold text-center uppercase tracking-wider">
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Operative Name</Label>
                <Input 
                  placeholder="John Doe" 
                  className="bg-white/5 border-white/10 focus-visible:border-emerald-500 focus-visible:ring-0 rounded-none h-12 text-white px-4 font-medium transition-colors" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Comms Link (Email)</Label>
                <Input 
                  type="email" 
                  placeholder="agent@shogun.dev" 
                  className="bg-white/5 border-white/10 focus-visible:border-emerald-500 focus-visible:ring-0 rounded-none h-12 text-white px-4 font-medium transition-colors" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Passcode</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="bg-white/5 border-white/10 focus-visible:border-emerald-500 focus-visible:ring-0 rounded-none h-12 text-white px-4 pr-10 font-medium transition-colors" 
                      value={formData.password} 
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                      required 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Verify</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-white/5 border-white/10 focus-visible:border-emerald-500 focus-visible:ring-0 rounded-none h-12 text-white px-4 font-medium transition-colors" 
                    value={formData.confirmPassword} 
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black h-14 rounded-none transition-all text-sm uppercase tracking-[0.2em]"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Access"}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
              Already an operative? <Link href="/login" className="text-emerald-500 hover:text-emerald-400 ml-2 transition-colors">Authenticate</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
