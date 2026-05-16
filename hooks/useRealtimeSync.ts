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
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      };

      socket.on("project-updated", handleProjectUpdated);
      socket.on("team-updated", handleTeamUpdated);

      return () => {
        socket.off("project-updated", handleProjectUpdated);
        socket.off("team-updated", handleTeamUpdated);
      };
    }

    // 2. Production Fallback: Background Polling [resilient-fallback]
    // Since Vercel doesn't support persistent WebSockets, we poll every 10s if socket is offline.
    if (!isConnected) {
      console.log("Realtime: Socket offline, starting production polling fallback...");
      const pollInterval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
        // Only invalidate team once in a while to save resources
        if (Math.random() > 0.7) {
           queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
        }
      }, 10000); // 10 second refresh

      return () => clearInterval(pollInterval);
    }
  }, [queryClient, socket, isConnected]);
}
