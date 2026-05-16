"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    
    // In production, only connect if a custom socket URL is explicitly provided.
    // This prevents "localhost:4000" connection errors on Vercel.
    if (!isDev && !socketUrl) {
      console.log("Realtime: No socket URL provided for production. Real-time features will use polling fallback.");
      return;
    }

    const finalUrl = socketUrl || "http://localhost:4000";
    
    const socketInstance = new (ClientIO as any)(finalUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      
      // If user is logged in, join their private room
      if (session?.user) {
        socketInstance.emit("join_user", (session.user as any).id || (session.user as any)._id);
      }
      // Always join legacy channels for compatibility
      socketInstance.emit("join_channel", "projects-channel");
      socketInstance.emit("join_channel", "team-channel");
      
      if ((session?.user as any)?.role === "admin") {
        socketInstance.emit("join_channel", "admin-channel");
      }
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [session]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
