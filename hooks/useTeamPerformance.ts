import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { useSocket } from "@/components/providers/SocketProvider";

export function useTeamPerformance() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.performance.list(),
    queryFn: async () => {
      const res = await fetch("/api/analytics/team-performance", { cache: "no-store" });
      const json = await res.json();
      if (!json.success) throw new Error("Failed to fetch performance");
      return json.data.performance;
    },
    staleTime: 0,
    gcTime: 0, // Disable cache to force fresh data every time
  });

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.performance.list() });
    };

    socket.on("project-updated", handleUpdate);
    socket.on("team-updated", handleUpdate);

    return () => {
      socket.off("project-updated", handleUpdate);
      socket.off("team-updated", handleUpdate);
    };
  }, [queryClient, socket, isConnected]);

  return query;
}
