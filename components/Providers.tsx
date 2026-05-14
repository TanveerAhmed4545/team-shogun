"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import QueryProvider from "./providers/QueryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
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
      </QueryProvider>
    </SessionProvider>
  );
}
