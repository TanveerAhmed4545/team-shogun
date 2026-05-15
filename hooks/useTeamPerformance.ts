import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";

export function useTeamPerformance() {
  return useQuery({
    queryKey: queryKeys.performance.list(),
    queryFn: async () => {
      const res = await fetch("/api/analytics/team-performance");
      const json = await res.json();
      if (!json.success) throw new Error("Failed to fetch performance");
      return json.data.performance;
    },
  });
}
