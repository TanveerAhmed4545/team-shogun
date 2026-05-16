import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/SocketProvider";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function useNotifications() {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const json = await res.json();
      return json.data?.notifications || [];
    },
  });

  const markAsRead = useMutation({
    mutationFn: async ({ id, markAll }: { id?: string; markAll?: boolean }) => {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, markAll }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNotification = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      
      toast(data.title || "New Notification", {
        icon: "🔔",
        style: {
          background: "#12181F",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
          fontSize: "12px",
          fontWeight: "bold",
        },
      });
    };

    socket.on("notification-received", handleNotification);

    return () => {
      socket.off("notification-received", handleNotification);
    };
  }, [socket, isConnected, queryClient]);

  const notifications = data || [];
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
  };
}
