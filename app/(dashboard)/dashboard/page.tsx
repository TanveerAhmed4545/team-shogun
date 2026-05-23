import React from "react";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";

export const metadata = {
  title: "Dashboard | Team Shogun",
  description: "Real-time performance orchestration for your agency operations.",
};

export default function Dashboard() {
  return (
    <ClientDashboard />
  );
}
