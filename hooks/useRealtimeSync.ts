import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/SocketProvider";
import { queryKeys } from "@/lib/queries/keys";
import toast from "react-hot-toast";

export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleProjectUpdated = (data: any) => {
      console.log("Realtime: Project Updated", data);
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
      
      if (data?.userId !== "self") { 
        toast("Dashboard updated via live sync", {
          icon: "🔄",
          style: {
            background: "#12181F",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "12px",
            fontWeight: "bold",
          },
        });
      }
    };

    const handleTeamUpdated = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    };

    // Listen to events on the global dashboard channel
    // Note: The server emits these events to the 'dashboard-channel' room
    socket.on("project-updated", handleProjectUpdated);
    socket.on("team-updated", handleTeamUpdated);

    return () => {
      socket.off("project-updated", handleProjectUpdated);
      socket.off("team-updated", handleTeamUpdated);
    };
  }, [queryClient, socket, isConnected]);
}
