"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-blue-500/8 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
              <span className="text-white font-black text-2xl italic">S</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">SHOGUN</h1>
          </div>
          <p className="text-white/40 font-medium">Sign in to your operations center</p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-10 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-rose-400 text-sm font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">Email Address</Label>
              <Input
                type="email"
                placeholder="you@shogun.dev"
                className="bg-white/5 border-white/5 focus:border-emerald-500/50 rounded-xl h-12 text-white placeholder:text-white/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                suppressHydrationWarning
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-white/5 border-white/5 focus:border-emerald-500/50 rounded-xl h-12 text-white pr-12 placeholder:text-white/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black h-12 rounded-xl shadow-xl shadow-emerald-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center space-x-2">
                  <span>Enter Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-white/30 text-sm font-medium">
              No account yet?{" "}
              <Link href="/register" className="text-emerald-500 font-black hover:text-emerald-400 transition-colors">
                Request Access
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
