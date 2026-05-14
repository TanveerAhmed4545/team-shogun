import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getPusherClient } from "@/lib/pusher";
import { queryKeys } from "@/lib/queries/keys";
import toast from "react-hot-toast";

export function useRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const pusherClient = getPusherClient();
    if (!pusherClient) return;

    // 1. Subscribe to the relevant channels
    const projectChannel = pusherClient.subscribe("projects-channel");
    const analyticsChannel = pusherClient.subscribe("analytics-channel");
    const teamChannel = pusherClient.subscribe("team-channel");

    // 2. Listen for "PROJECT_UPDATED"
    projectChannel.bind("project-updated", (data: any) => {
      console.log("Realtime: Project Updated", data);
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
      
      // Optional: Toast for other users' actions
      if (data.userId !== "self") { // We'll handle self-id later if needed
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
    });

    // 3. Listen for "TEAM_UPDATED"
    teamChannel.bind("team-updated", () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    });

    // Cleanup on unmount
    return () => {
      if (pusherClient) {
        pusherClient.unsubscribe("projects-channel");
        pusherClient.unsubscribe("analytics-channel");
        pusherClient.unsubscribe("team-channel");
      }
    };
  }, [queryClient]);
}
