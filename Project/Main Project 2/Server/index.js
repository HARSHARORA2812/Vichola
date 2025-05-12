import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './Database/Db.js';
import authRoutes from './Routers/AuthRoutes.js';
import profileRoute from './Routers/profileRoutes.js';
import cookieParser from 'cookie-parser';
import matchRoute from './Routers/MatchRoutes.js';
import reviewRouter from './Routers/ReviewRoutes.js';
import chatRoute from './Routers/ChatRoutes.js';
import adminRoutes from './Routers/AdminRoutes.js';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
const httpServer = createServer(app);

// Use an environment variable for the frontend origin in production
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(httpServer, {
  cors: {
    origin: frontendURL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: frontendURL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

await connectDB();

// JWT verification middleware for socket
const authenticateSocketUser = async (socket, next) => {
  try {
    // Check if token exists in handshake auth
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    // console.log('Socket middleware authenticated user:', socket.userId);
    next();
  } catch (error) {
    console.error('Socket authentication middleware error:', error);
    next(new Error('Authentication error: Invalid token'));
  }
};

// Apply middleware to all socket connections
// io.use(authenticateSocketUser);

// Socket.io connection handler
io.on('connection', (socket) => {
  // console.log('New client connected', socket.id);
  
  // Check if we received auth in the initial connection
  if (socket.handshake.auth && socket.handshake.auth.token) {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      // console.log('Socket authenticated on connection for user:', socket.userId);
      
      // Join a personal room for direct messages
      socket.join(`user:${socket.userId}`);
      socket.emit('authenticated', { success: true });
    } catch (error) {
      console.error('Initial socket auth failed:', error);
      socket.emit('authenticated', { success: false, error: 'Authentication failed' });
    }
  }
  
  // Authenticate socket connection
  socket.on('authenticate', async (token) => {
    try {
      if (!token) {
        // console.error('No token provided for authentication');
        socket.emit('authenticated', { success: false, error: 'No token provided' });
        return;
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log('Socket auth token decoded:', decoded);
      
      // Support both id and userId fields for compatibility
      const userId = decoded.id || decoded.userId;
      
      if (!userId) {
        // console.error('No user ID found in token:', decoded);
        socket.emit('authenticated', { success: false, error: 'Invalid token format - missing user ID' });
        return;
      }
      
      socket.userId = userId;
      // console.log('Socket authenticated for user:', userId);
      
      // Join a personal room for direct messages
      socket.join(`user:${socket.userId}`);
      socket.emit('authenticated', { success: true, userId: userId });
    } catch (error) {
      console.error('Socket authentication failed:', error);
      socket.emit('authenticated', { success: false, error: 'Authentication failed' });
    }
  });
  
  // Join a chat room
  socket.on('join_chat', (chatId) => {
    if (!socket.userId) {
      // console.log('Rejecting join_chat - not authenticated');
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }
    
    // Validate chatId
    if (!chatId) {
      // console.error('Invalid chat ID');
      socket.emit('error', { message: 'Invalid chat ID' });
      return;
    }
    
    // console.log(`User ${socket.userId} joined chat ${chatId}`);
    socket.join(`chat:${chatId}`);
    socket.emit('joined_chat', { chatId });
  });
  
  // Handle new messages
  socket.on('send_message', (data) => {
    try {
      if (!socket.userId) {
        // console.log('Rejecting send_message - not authenticated');
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }
      
      if (!data || !data.chatId || !data.content) {
        socket.emit('error', { message: 'Invalid message data' });
        return;
      }
      
      // console.log(`New message in chat ${data.chatId} from user ${socket.userId} to ${data.receiverId}`);
      
      // Broadcast to everyone in the chat room except sender
      socket.to(`chat:${data.chatId}`).emit('receive_message', {
        ...data,
        senderId: socket.userId
      });
      
      // Also emit back to the sender to ensure they see their own messages
      socket.emit('receive_message', {
        ...data,
        senderId: socket.userId,
        fromSelf: true
      });
      
      // Also send to specific user's personal room if they're not in the chat room
      if (data.receiverId) {
        socket.to(`user:${data.receiverId}`).emit('new_message_notification', {
          chatId: data.chatId,
          senderId: socket.userId,
          preview: data.content.substring(0, 30)
        });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('error', { message: 'Failed to process message' });
    }
  });
  
  // Handle typing indicators
  socket.on('typing', (data) => {
    try {
      if (!socket.userId) {
        // console.log('Rejecting typing - not authenticated');
        return;
      }
      
      if (!data || !data.chatId) {
        return;
      }
      
      socket.to(`chat:${data.chatId}`).emit('user_typing', {
        userId: socket.userId,
        isTyping: !!data.isTyping
      });
    } catch (error) {
      console.error('Error handling typing indicator:', error);
    }
  });
  
  socket.on('disconnect', () => {
    // console.log('Client disconnected', socket.id);
  });
  
  // Handle general errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

app.use('/api/users', authRoutes);
app.use('/api/profile', profileRoute);
app.use('/api/match', matchRoute);
app.use('/api/reviews', reviewRouter);
app.use('/api/chat', chatRoute);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
