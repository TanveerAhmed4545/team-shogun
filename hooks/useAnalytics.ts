import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { useEffect } from "react";
import { getPusherClient } from "@/lib/pusher";

export interface AnalyticsData {
  revenue: number;
  activeOrders: number;
  totalProjects: number;
  totalMembers: number;
  completionRate: number;
  cancelledRate: number;
}

export function useAnalytics() {
  const queryClient = useQueryClient();

  // Real-time synchronization [rt-sync-effect]
  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe("projects-channel");
    
    channel.bind("project-updated", () => {
      // Invalidate analytics data when any project changes
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [queryClient]);

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
      };
    },
    staleTime: 60000,
  });
}
