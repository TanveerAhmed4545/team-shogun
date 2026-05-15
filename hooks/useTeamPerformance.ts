import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { getPusherClient } from "@/lib/pusher";

export function useTeamPerformance() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.performance.list(),
    queryFn: async () => {
      const res = await fetch("/api/analytics/team-performance");
      const json = await res.json();
      if (!json.success) throw new Error("Failed to fetch performance");
      return json.data.performance;
    },
  });

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe("projects-channel");
    
    channel.bind("project-updated", () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.performance.list() });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [queryClient]);

  return query;
}
