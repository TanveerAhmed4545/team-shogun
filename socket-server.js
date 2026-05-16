const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true // Support older clients if any
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a specific user room for private notifications
  socket.on('join_user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`Socket ${socket.id} joined user-${userId}`);
  });

  // Join specific channels
  socket.on('join_channel', (channel) => {
    socket.join(channel);
    console.log(`Socket ${socket.id} joined channel: ${channel}`);
  });

  socket.on('join_project', (projectId) => {
    socket.join(`project-${projectId}`);
    console.log(`Socket ${socket.id} joined project-${projectId}`);
  });

  // Chat Rooms
  socket.on('join_chat', (projectId) => {
    socket.join(`chat-${projectId}`);
    console.log(`Socket ${socket.id} joined chat-${projectId}`);
  });

  socket.on('leave_chat', (projectId) => {
    socket.leave(`chat-${projectId}`);
    console.log(`Socket ${socket.id} left chat-${projectId}`);
  });

  // Typing indicators
  socket.on('typing', ({ projectId, userName }) => {
    socket.to(`chat-${projectId}`).emit('user_typing', { userName });
  });

  socket.on('stop_typing', ({ projectId, userName }) => {
    socket.to(`chat-${projectId}`).emit('user_stop_typing', { userName });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// REST endpoint for Next.js API to trigger socket events
app.post('/emit', (req, res) => {
  const { channel, event, data } = req.body;
  
  if (!channel || !event) {
    return res.status(400).json({ error: 'Channel and event are required' });
  }

  // Example: POST /emit { channel: 'dashboard-channel', event: 'project-updated', data: { id: 1 } }
  io.to(channel).emit(event, data);
  res.status(200).json({ success: true });
});

const PORT = process.env.SOCKET_PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.io Server running on port ${PORT}`);
});
