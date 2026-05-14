"use client";
import { useSession } from "next-auth/react";

export default function TestRolePage() {
  const { data: session, status } = useSession();
  return (
    <div className="p-10 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      <pre className="bg-white/5 p-4 rounded-xl">
        {JSON.stringify({ status, session }, null, 2)}
      </pre>
    </div>
  );
}
