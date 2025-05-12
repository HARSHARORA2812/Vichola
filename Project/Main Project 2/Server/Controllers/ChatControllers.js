import Chat from '../Models/ChatModel.js';
import { sendResponse } from '../Utils/response.js';
import mongoose from 'mongoose';

export const getChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // console.log(`Getting chat between ${currentUserId} and ${userId}`);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendResponse(res, 400, 'Invalid user ID format');
    }

    // Find the chat between the two users - use String comparison instead of ObjectId conversion
    let chat = await Chat.findOne({
      users: { 
        $all: [currentUserId, userId] 
      }
    })
    .populate('users', 'username email')
    .populate('messages.sender', 'username email');

    if (!chat) {
      // console.log(`No existing chat found between ${currentUserId} and ${userId}, CREATING new chat`);
      chat = new Chat({
        users: [currentUserId, userId],
        messages: []
      });
      await chat.save(); // Save the new chat to get an _id
      // Populate users for consistency, even if messages are empty
      await chat.populate('users', 'username email');
      // No need to populate messages.sender as there are no messages yet
      // console.log(`Created new chat with ID: ${chat._id}`);
      // Return the newly created chat
      return sendResponse(res, 200, 'New chat created successfully', chat);
    }

    // If chat was found, proceed as before
    // console.log(`Found chat with ID: ${chat._id} and ${chat.messages.length} messages`);
    sendResponse(res, 200, 'Chat retrieved successfully', chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    sendResponse(res, 500, 'Failed to fetch chat', error.message);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { content } = req.body;
    const currentUserId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendResponse(res, 400, 'Invalid user ID format');
    }

    if (!content || content.trim() === '') {
      return sendResponse(res, 400, 'Message content cannot be empty');
    }

    // console.log(`Sending message from ${currentUserId} to ${userId}: \"${content.substring(0, 30)}...\"`);

    // Find or create chat - use strings instead of converting to ObjectId
    let chat = await Chat.findOne({
      users: { 
        $all: [currentUserId, userId] 
      }
    });

    if (!chat) {
      // console.log('Creating new chat');
      chat = new Chat({
        users: [currentUserId, userId],
        messages: [],
      });
    }

    // Add the new message
    const newMessage = {
      sender: currentUserId,
      content: content.trim(),
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    await chat.save();

    // Populate the chat data
    await chat.populate('messages.sender', 'username email');
    await chat.populate('users', 'username email');

    // console.log(`Message sent successfully, chat now has ${chat.messages.length} messages`);
    sendResponse(res, 201, 'Message sent successfully', chat);
  } catch (error) {
    console.error('Error sending message:', error);
    sendResponse(res, 500, 'Failed to send message', error.message);
  }
};

// Get all chats for the current user
export const getAllChats = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    // console.log(`Getting all chats for user ${currentUserId}`);
    
    const chats = await Chat.find({
      users: currentUserId
    })
    .populate('users', 'username email')
    .populate('messages.sender', 'username email')
    .sort({ updatedAt: -1 });
    
    // console.log(`Found ${chats.length} chats`);
    
    // Format the response to include the latest message and timestamp
    const formattedChats = chats.map(chat => {
      const otherUser = chat.users.find(user => 
        user._id.toString() !== currentUserId
      );
      
      const latestMessage = chat.messages.length > 0 
        ? chat.messages[chat.messages.length - 1] 
        : null;
        
      return {
        chatId: chat._id,
        otherUser,
        latestMessage,
        updatedAt: chat.updatedAt,
        messageCount: chat.messages.length
      };
    });
    
    sendResponse(res, 200, 'Chats retrieved successfully', formattedChats);
  } catch (error) {
    console.error('Error fetching all chats:', error);
    sendResponse(res, 500, 'Failed to fetch chats', error.message);
  }
};