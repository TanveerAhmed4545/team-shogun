import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";

export interface AnalyticsData {
  revenue: number;
  activeOrders: number;
  totalProjects: number;
  totalMembers: number;
  completionRate: number;
  cancelledRate: number;
}

export function useAnalytics() {
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
