"use client";

import { motion } from "framer-motion";
import { Clock, Mail, Shield } from "lucide-react";
import { signOut } from "next-auth/react";

export default function PendingPage() {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-amber-500/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-emerald-500/8 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg text-center"
      >
        {/* Animated Pending Icon */}
        <div className="relative mx-auto mb-10 w-28 h-28">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/30"
          />
          <div className="absolute inset-2 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Clock className="w-12 h-12 text-amber-500" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
          >
            <span className="text-white text-[10px] font-black">!</span>
          </motion.div>
        </div>

        {/* Logo */}
        <div className="inline-flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <span className="text-white font-black text-xl italic">S</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">SHOGUN</h1>
        </div>

        {/* Content */}
        <div className="glass-card rounded-3xl p-10 border border-white/5 shadow-2xl space-y-6">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Awaiting <span className="text-amber-500">Clearance</span>
          </h2>
          <p className="text-white/40 font-medium leading-relaxed max-w-sm mx-auto">
            Your registration has been received. An admin will review and approve your access within 24 hours.
          </p>

          {/* Status Info Cards */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <Shield className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Status</p>
                <p className="text-sm font-black text-amber-500">Pending</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Contact</p>
                <p className="text-sm font-black text-emerald-500">Admin</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-white/30 text-sm font-bold hover:text-rose-500 transition-colors"
            >
              Sign out and try again later
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
