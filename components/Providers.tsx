"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import QueryProvider from "./providers/QueryProvider";
import { SocketProvider } from "./providers/SocketProvider";
import dynamic from "next/dynamic";
import { ThemeProvider } from "./providers/ThemeProvider";

// Lazy-load heavy dashboard-only components — they should never block the public landing page
const CommandPalette = dynamic(() => import("./dashboard/CommandPalette").then(m => ({ default: m.CommandPalette })), {
  ssr: false,
});

// Only open a WebSocket connection when the user is signed in
function SessionGate({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  if (!session) return <>{children}</>;
  return <SocketProvider>{children}</SocketProvider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider>
        <QueryProvider>
          <SessionGate>
            {children}
          </SessionGate>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111827",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                fontSize: "14px",
                fontWeight: "700",
              },
              success: {
                iconTheme: { primary: "#22C55E", secondary: "#fff" },
              },
              error: {
                iconTheme: { primary: "#EF4444", secondary: "#fff" },
              },
            }}
          />
          <CommandPalette />
        </QueryProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

