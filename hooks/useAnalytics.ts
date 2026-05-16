import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { useEffect } from "react";
import { useSocket } from "@/components/providers/SocketProvider";

export interface AnalyticsData {
  revenue: number;
  activeOrders: number;
  totalProjects: number;
  totalMembers: number;
  completionRate: number;
  cancelledRate: number;
  statusDistribution: any[];
  monthlyRevenue: any[];
}

export function useAnalytics() {
  const queryClient = useQueryClient();

  const { socket, isConnected } = useSocket();

  // Real-time synchronization [rt-sync-effect]
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    };

    socket.on("project-updated", handleUpdate);
    socket.on("team-updated", handleUpdate);

    return () => {
      socket.off("project-updated", handleUpdate);
      socket.off("team-updated", handleUpdate);
    };
  }, [queryClient, socket, isConnected]);

  return useQuery<AnalyticsData>({
    queryKey: queryKeys.analytics.all,
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      return {
        revenue: data.revenue || 0,
        activeOrders: data.activeOrders || 0,
        totalProjects: data.totalProjects || 0,
        totalMembers: data.totalMembers || 0,
        completionRate: data.completionRate || 0,
        cancelledRate: data.cancelledRate || 0,
        statusDistribution: data.statusDistribution || [],
        monthlyRevenue: data.monthlyRevenue || [],
      };
    },
    staleTime: 60000,
  });
}
