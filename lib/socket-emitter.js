/**
 * Socket.io emitter utility for Next.js API routes.
 * Sends events to the standalone socket-server.js /emit endpoint.
 */

const SOCKET_SERVER_URL = process.env.INTERNAL_SOCKET_URL || "http://localhost:4000";
const SOCKET_SECRET = process.env.NEXTAUTH_SECRET || process.env.CRON_SECRET || "";

export async function emitSocketEvent(channel, event, data) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (SOCKET_SECRET) {
      headers['Authorization'] = `Bearer ${SOCKET_SECRET}`;
    }

    const response = await fetch(`${SOCKET_SERVER_URL}/emit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        channel,
        event,
        data,
      }),
    });

    if (!response.ok) {
      console.warn(`Socket emit failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Socket emit error:', error);
  }
}
