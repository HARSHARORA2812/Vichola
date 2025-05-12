// In Routers/ChatRoutes.js
import express from 'express';
import {
  getChat,
  sendMessage,
  getAllChats
} from '../Controllers/ChatControllers.js';
// Import the default export (authenticateToken) and rename it to 'protect' for usage
import protect from '../Middleware/authMiddleware.js';

const router = express.Router();

// Fetch all chats for the current user
router.get('/', protect, getAllChats);

// Fetch/create a specific chat with a user
router.get('/:userId', protect, getChat);

// Send a message to a specific user (finds or creates chat)
router.post('/:userId', protect, sendMessage);

export default router;