const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('@dotenvx/dotenvx');
const connectToDb = require('./config/db');
const userRoutes = require('./routes/user');
const questionRoutes = require('./routes/question');
const answerRoutes = require('./routes/answer');
const reportRoutes = require('./routes/report');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notification');
const liveThreadRoutes = require('./routes/liveThread');
const { startThreadCleanupJob } = require('./services/threadCleanup');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://vishal-mega-mart-rouge.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

dotenv.config();
const port = process.env.PORT || 5000;

//Database connection
connectToDb();

// Store active thread connections
const activeThreads = new Map(); // threadId -> Set of socket.ids
const socketToUser = new Map(); // socket.id -> { userId, threadId }

//Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'https://vishal-mega-mart-rouge.vercel.app'], // Your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Make io accessible to routes
app.set('socketio', io);

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/answers', answerRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/live-threads', liveThreadRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Join a live thread
  socket.on('join-thread', (data) => {
    const { threadId, userId } = data;
    
    // Leave previous thread if any
    const prevData = socketToUser.get(socket.id);
    if (prevData && prevData.threadId) {
      socket.leave(prevData.threadId);
      const prevThreadSockets = activeThreads.get(prevData.threadId);
      if (prevThreadSockets) {
        prevThreadSockets.delete(socket.id);
        if (prevThreadSockets.size === 0) {
          activeThreads.delete(prevData.threadId);
        }
        io.to(prevData.threadId).emit('participant-count', prevThreadSockets.size);
      }
    }

    // Join new thread
    socket.join(threadId);
    socketToUser.set(socket.id, { userId, threadId });
    
    if (!activeThreads.has(threadId)) {
      activeThreads.set(threadId, new Set());
    }
    activeThreads.get(threadId).add(socket.id);
    
    // Notify thread about participant count
    const threadSockets = activeThreads.get(threadId);
    io.to(threadId).emit('participant-count', threadSockets.size);
    
    console.log(`User ${userId} joined thread ${threadId}`);
  });

  // Handle new message in thread
  socket.on('thread-message', (data) => {
    const { threadId, message, userId, username } = data;
    
    // Broadcast message to all participants in the thread
    socket.to(threadId).emit('new-message', {
      id: Date.now(), // Temporary ID, should be replaced with actual DB ID
      userId,
      username,
      content: message,
      timestamp: new Date(),
      threadId
    });
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { threadId, userId, username, isTyping } = data;
    socket.to(threadId).emit('user-typing', { userId, username, isTyping });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
    
    const userData = socketToUser.get(socket.id);
    if (userData && userData.threadId) {
      const threadSockets = activeThreads.get(userData.threadId);
      if (threadSockets) {
        threadSockets.delete(socket.id);
        if (threadSockets.size === 0) {
          activeThreads.delete(userData.threadId);
        } else {
          io.to(userData.threadId).emit('participant-count', threadSockets.size);
        }
      }
    }
    
    socketToUser.delete(socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  
  // Start the thread cleanup job
  startThreadCleanupJob();
  console.log('Thread cleanup job started');
});