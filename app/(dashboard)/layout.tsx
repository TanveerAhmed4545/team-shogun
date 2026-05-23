import React from "react";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-[100dvh] mesh-bg text-foreground selection:bg-emerald-500/30">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0 bg-background">
          {/* Ambient atmospheric gradients (retained for premium feel, but stripped back) */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.04] blur-[150px] rounded-full -z-10 pointer-events-none" />
          <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[150px] rounded-full -z-10 pointer-events-none" />

          <DashboardHeader />

          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
