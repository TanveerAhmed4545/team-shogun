import React from "react";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.05] bg-[#07090e] py-12 relative overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">
        
        {/* Left Brand details */}
        <div className="md:col-span-4 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black shadow-lg shadow-emerald-500/20 shrink-0">
              <Image src="/shogun-logo.png" alt="Shogun" fill className="object-cover" />
            </div>
            <span className="text-md font-black tracking-wider text-white font-sans">SHOGUN<span className="text-emerald-500">.</span></span>
          </div>
          <p className="text-xs text-white/30 max-w-xs font-medium font-sans">
            Enterprise Operations Orchestrator developed carefully for elite high-volume freelance groups.
          </p>
        </div>

        {/* Core System Indicators */}
        <div className="md:col-span-5 flex flex-wrap gap-4 text-[9px] font-mono text-white/20 uppercase">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/50" /> System: ACTIVE
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/50" /> Websockets: ACTIVE
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/50" /> Cron Alerts: ACTIVE
          </div>
        </div>

        {/* Credits */}
        <div className="md:col-span-3 text-left md:text-right space-y-1 font-sans">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
            © {new Date().getFullYear()} Team Shogun
          </p>
          <p className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-wider">
            Orchestrated by Tanveer Ahmed
          </p>
        </div>

      </div>
    </footer>
  );
};

