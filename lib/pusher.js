import { projectService } from "./services/project.service";

/**
 * Socket.io Real-time Infrastructure
 * This replaces the legacy Pusher implementation with a local Socket.io bridge.
 */

const socketServerUrl = process.env.SOCKET_SERVER_URL || 'http://localhost:4000';

const triggerSocketEvent = async (channel, event, data) => {
  try {
    const res = await fetch(`${socketServerUrl}/emit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channel, event, data }),
    });

    if (!res.ok) {
      console.warn(`Socket.io trigger failed on ${channel}/${event}: ${res.statusText}`);
    } else {
      // console.log(`Socket.io event emitted: ${channel}/${event}`);
    }
  } catch (error) {
    console.warn(`Socket.io trigger failed on ${channel}/${event}:`, error.message);
  }
};

export const pusherServer = {
  trigger: triggerSocketEvent
};

export default pusherServer;
