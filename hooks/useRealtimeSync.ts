import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/SocketProvider";
import { queryKeys } from "@/lib/queries/keys";
import toast from "react-hot-toast";

export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    // 1. Standalone Socket.io Logic (Local/Custom Server)
    if (socket && isConnected) {
      const handleProjectUpdated = (data: any) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
        
        if (data?.userId !== "self") { 
          toast("Dashboard updated via live sync", { icon: "🔄" });
        }
      };

      const handleTeamUpdated = () => {
        // Invalidate only the users list — NOT the full ['users'] root
        // (which would cascade into profile queries and cause constant profile reloads)
        queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      };

      socket.on("project-updated", handleProjectUpdated);
      socket.on("team-updated", handleTeamUpdated);

      return () => {
        socket.off("project-updated", handleProjectUpdated);
        socket.off("team-updated", handleTeamUpdated);
      };
    }

    // 2. Production Fallback: Background Polling [resilient-fallback]
    // Since Vercel doesn't support persistent WebSockets, we poll every 30s if socket is offline.
    // We only refresh projects + analytics — NOT users, to avoid cascading into profile queries.
    if (!isConnected) {
      const pollInterval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
        // Do NOT invalidate queryKeys.users.all here — it cascades into profile
        // and causes the profile page to reload every poll cycle.
      }, 30000); // 30 second refresh

      return () => clearInterval(pollInterval);
    }
  }, [queryClient, socket, isConnected]);
}
