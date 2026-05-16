/**
 * Socket.io emitter utility for Next.js API routes.
 * Sends events to the standalone socket-server.js /emit endpoint.
 */

const SOCKET_SERVER_URL = process.env.INTERNAL_SOCKET_URL || "http://localhost:4000";

export async function emitSocketEvent(channel, event, data) {
  try {
    const response = await fetch(`${SOCKET_SERVER_URL}/emit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
