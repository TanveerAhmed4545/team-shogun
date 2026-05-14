/**
 * Real-time Sync Utility
 * 
 * We use dynamic require inside functions to prevent Next.js/Turbopack 
 * from attempting to initialize Pusher during the static build phase.
 */

const getPusherServer = () => {
  if (typeof window !== "undefined") return null;
  try {
    const Pusher = require("pusher");
    return new Pusher({
      appId: process.env.PUSHER_APP_ID || "mock",
      key: process.env.NEXT_PUBLIC_PUSHER_KEY || "mock",
      secret: process.env.PUSHER_SECRET || "mock",
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mock",
      useTLS: true,
    });
  } catch (error) {
    console.warn("Pusher initialization failed:", error.message);
    return null;
  }
};

const triggerPusher = async (channel, event, data) => {
  const pusher = getPusherServer();
  if (!pusher) return;
  try {
    await pusher.trigger(channel, event, data);
  } catch (error) {
    console.warn(`Pusher trigger failed on ${channel}/${event}:`, error.message);
  }
};

const getPusherClient = () => {
  const PusherClient = require("pusher-js");
  return new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || "mock", {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1",
  });
};

module.exports = {
  triggerPusher,
  getPusherClient,
  // Backward compatibility for existing code
  pusherServer: {
    trigger: triggerPusher
  }
};
