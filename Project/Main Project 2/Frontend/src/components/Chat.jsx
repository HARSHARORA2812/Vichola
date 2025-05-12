import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSend, IoArrowBack, IoHeart, IoAttach, IoHappy, IoEllipsisVertical } from 'react-icons/io5';
import { io } from 'socket.io-client';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState({ messages: [] });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const socketRef = useRef(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Store userId on component mount and set a loading timeout
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    // Debug localStorage
    // console.log('localStorage contents:', {
    //   token: token ? 'exists' : 'missing',
    //   userId: userId || 'missing'
    // });
    
    if (userId) {
      // console.log('Current user ID:', userId);
      setCurrentUserId(userId);
    } else {
      console.error('No userId found in localStorage');
      setError('User not properly authenticated. Please log out and log in again.');
      setLoading(false);
    }
    
    // Removed the generic 10-second timeout logic from here.
    // We will rely on fetchChat's own error handling and axios timeout.
    
    // setLoadingTimeout(timeout); // Removed
    
    // return () => { // Removed
    //   if (loadingTimeout) clearTimeout(loadingTimeout); // Removed
    // }; // Removed
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);
  
  // Socket.io connection setup
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token || !currentUserId) {
      // console.error('Missing auth credentials', { token: !!token, userId: !!currentUserId });
      if (!token) navigate('/login');
      return;
    }
    
    try {
      // console.log('Setting up socket connection with userId:', currentUserId);
      
      // Initialize socket connection with relative path (defaults to current host)
      const socket = io({ 
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        auth: {
          token: token
        },
        query: {
          token: token  // Backup token in query for older Socket.io versions
        }
      });
      
      socketRef.current = socket;
      
      // Connection established event
      socket.on('connect', () => {
        // console.log('Socket connected with ID:', socket.id);
        
        // Authenticate explicitly after connection to ensure token is processed
        socket.emit('authenticate', token);
        
        // Set a timeout to check if authentication succeeded
        setTimeout(() => {
          if (!isSocketConnected) {
            // console.warn('Socket authentication timeout - attempting to reconnect');
            socket.disconnect().connect(); // Force reconnection
          }
        }, 5000);
      });
      
      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        setError(`Connection error: ${err.message}`);
      });
      
      socket.on('authenticated', (response) => {
        if (response.success) {
          setIsSocketConnected(true);
          // console.log('Socket authenticated successfully');
          
          // Update currentUserId if it came from the server
          if (response.userId) {
            // console.log('Got userId from socket auth:', response.userId);
            
            // Update our state
            setCurrentUserId(response.userId);
            
            // Also update localStorage if needed
            if (!localStorage.getItem('userId')) {
              localStorage.setItem('userId', response.userId);
              // console.log('Saved userId to localStorage from socket:', response.userId);
            }
          }
        } else {
          console.error('Socket authentication failed:', response.error);
          setError('Failed to establish real-time connection: ' + (response.error || 'Authentication failed'));
        }
      });
      
      socket.on('joined_chat', (data) => {
        // console.log('Successfully joined chat room:', data.chatId);
      });
      
      socket.on('receive_message', (newMessage) => {
        // console.log('Received new message:', newMessage);
        
        // Avoid duplication if this is a message we sent ourselves
        if (newMessage.fromSelf) {
          // console.log('This is our own message being reflected back, updating status');
          // Update status of pending messages instead of adding duplicates
          setChat(prevChat => ({
            ...prevChat,
            messages: prevChat.messages.map(msg => {
              // If we find a pending message with matching content, mark it as delivered
              if (msg.pending && msg.content === newMessage.content) {
                return {
                  ...msg,
                  pending: false,
                  _id: newMessage._id || msg._id,
                };
              }
              return msg;
            })
          }));
          return;
        }
        
        // This is a message from someone else
        setChat(prevChat => ({
          ...prevChat,
          messages: [...prevChat.messages, {
            ...newMessage,
            sender: { _id: newMessage.senderId },
            timestamp: newMessage.timestamp || new Date().toISOString(),
            clientId: `received-${Date.now()}`
          }]
        }));
      });
      
      socket.on('user_typing', (data) => {
        if (data.userId !== currentUserId) {
          setTyping(data.isTyping);
        }
      });
      
      socket.on('error', (errorData) => {
        console.error('Socket error:', errorData);
        setError(`Socket error: ${errorData.message || 'Unknown error'}`);
      });
      
      // Cleanup function
      return () => {
        // console.log('Disconnecting socket');
        socket.off('authenticated');
        socket.off('receive_message');
        socket.off('user_typing');
        socket.off('error');
        socket.off('connect_error');
        socket.disconnect();
      };
    } catch (error) {
      console.error('Error setting up socket connection:', error);
      setError(`Failed to connect: ${error.message}`);
    }
  }, [navigate, currentUserId]);

  // Join chat room when chat ID is available and socket is authenticated
  useEffect(() => {
    if (isSocketConnected && socketRef.current && chat._id) {
      // console.log('Joining chat room:', chat._id);
      socketRef.current.emit('join_chat', chat._id);
    }
  }, [isSocketConnected, chat._id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !currentUserId) {
      // console.error('Missing auth credentials for chat fetch');
      if (!token) navigate('/login');
      return;
    }

    const fetchChat = async () => {
      try {
        setLoading(true);
        // console.log(`Fetching chat between current user (${currentUserId}) and user ${id}...`);
        
        // Use relative endpoint
        const response = await axios.get(`/api/chat/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000 // Increase timeout to 10 seconds
        });
        
        // Check for valid response
        if (!response.data) {
          throw new Error('Invalid response from server');
        }
        
        // console.log('Chat response:', response.data);
        
        // Handle case where we have empty chat data (no messages yet)
        const chatData = {
          ...response.data.data,
          _id: response.data.data?._id || `temp-chat-${currentUserId}-${id}`,
          messages: response.data.data?.messages || []
        };
        
        // Add unique IDs to messages if they don't have one
        const messagesWithIds = chatData.messages.map((msg, index) => ({
          ...msg,
          clientId: msg.clientId || `msg-${Date.now()}-${index}`
        }));
        
        setChat({
          ...chatData,
          messages: messagesWithIds
        });
        
        // If socket is connected and we have a chat ID, join the room
        if (isSocketConnected && socketRef.current && chatData._id) {
          // console.log('Joining chat room from fetch:', chatData._id);
          socketRef.current.emit('join_chat', chatData._id);
        }
        
        setError(null);
      } catch (error) {
        console.error('Chat fetch error:', error);
        let errorMessage = 'Failed to load chat';
        
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || error.message}`;
          console.error('Error response:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage = 'No response from server. Please check your connection.';
        }
        
        setError(errorMessage);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
    
    // Poll less frequently with socket.io in place
    const interval = setInterval(fetchChat, 30000);
    return () => clearInterval(interval);
  }, [id, navigate, currentUserId, isSocketConnected, socketRef]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Emit typing event to socket
    if (socketRef.current && isSocketConnected && chat._id) {
      socketRef.current.emit('typing', {
        chatId: chat._id,
        isTyping: true
      });
    }
    
    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);
    
    // Set new timeout for stopping typing indicator
    const timeout = setTimeout(() => {
      setTyping(false);
      if (socketRef.current && isSocketConnected && chat._id) {
        socketRef.current.emit('typing', {
          chatId: chat._id,
          isTyping: false
        });
      }
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || sendingMessage) return;

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      console.error('Missing auth credentials for sending message');
      setError('You need to be logged in to send messages');
      navigate('/login');
      return;
    }

    // Verify socket is connected
    if (!socketRef.current || !isSocketConnected) {
      console.error('Socket not connected or authenticated');
      setError('Connection issue. Please refresh the page.');
      return;
    }

    setSendingMessage(true);
    
    // Create a temporary message with a unique client ID
    const tempMsgId = `msg-${Date.now()}`;
    const msgContent = message.trim();
    
    const tempMsg = {
      clientId: tempMsgId,
      content: msgContent,
      sender: { _id: userId },
      timestamp: new Date().toISOString(),
      pending: true
    };
    
    // Add to UI immediately for better UX
    setChat(prev => ({
      ...prev,
      messages: [...prev.messages, tempMsg]
    }));
    
    setMessage('');
    
    try {
      // console.log(`Sending message to ${id} in chat ${chat._id || 'new chat'}`);
      
      // Try to send through Socket.io first for instant delivery
      if (socketRef.current && isSocketConnected && chat._id) {
        // console.log('Sending via socket first');
        socketRef.current.emit('send_message', {
          chatId: chat._id,
          content: msgContent,
          receiverId: id,
          timestamp: new Date().toISOString()
        });
      }
      
      // Then persist through API (more reliable but slower)
      const response = await axios.post(
        `/api/chat/${id}`, // Use relative endpoint
        { content: msgContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data?.data) {
        // console.log('Message saved to database:', response.data.data);
        
        // If we didn't send through socket already (or if we're not sure it was received),
        // send it now that we know we have a valid chat
        if (!isSocketConnected && socketRef.current && response.data.data._id) {
          socketRef.current.emit('send_message', {
            chatId: response.data.data._id,
            content: msgContent,
            receiverId: id,
            timestamp: new Date().toISOString()
          });
        }
        
        // Extract updated messages from response
        const updatedMessages = response.data.data.messages;
        
        if (updatedMessages?.length > 0) {
          // Add client IDs if not present
          const messagesWithIds = updatedMessages.map(msg => ({
            ...msg,
            clientId: msg.clientId || `msg-${Date.now()}-${Math.random()}`
          }));
          
          setChat(prev => ({
            ...response.data.data,
            messages: messagesWithIds.map(msg => {
              // Preserve pending state for our latest message if it's still sending
              if (msg.content === msgContent && 
                  msg.sender._id === userId && 
                  new Date(msg.timestamp) > new Date(Date.now() - 60000)) {
                return {
                  ...msg,
                  pending: false
                };
              }
              return msg;
            })
          }));
        }
        
        setError(null);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Send message error:', error);
      
      // Mark message as failed but don't remove it
      setChat(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.clientId === tempMsgId 
            ? { ...msg, pending: false, error: true } 
            : msg
        )
      }));
      
      setError(error.response?.data?.message || 'Failed to send message');
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setSendingMessage(false);
    }
  };

  // Retry sending a failed message
  const handleRetryMessage = async (failedMsg) => {
    if (!failedMsg || !failedMsg.content) return;

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    // Mark message as pending again
    setChat(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.clientId === failedMsg.clientId 
          ? { ...msg, pending: true, error: false } 
          : msg
      )
    }));
    
    try {
      // Try to send through API
      const response = await axios.post(
        `/api/chat/${id}`, // Use relative endpoint
        { content: failedMsg.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data?.data) {
        // Send through Socket.io also for real-time
        if (socketRef.current && isSocketConnected) {
          socketRef.current.emit('send_message', {
            chatId: response.data.data._id,
            content: failedMsg.content,
            receiverId: id,
            timestamp: new Date().toISOString()
          });
        }
        
        // Mark as sent successfully
        setChat(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg.clientId === failedMsg.clientId 
              ? { ...msg, pending: false, error: false } 
              : msg
          )
        }));
        
        setError(null);
      }
    } catch (error) {
      console.error('Retry message error:', error);
      
      // Mark as failed again
      setChat(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.clientId === failedMsg.clientId 
            ? { ...msg, pending: false, error: true } 
            : msg
        )
      }));
    }
  };

  const renderMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return `Today, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Generate a color based on username for avatar
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-indigo-50">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading conversation...</p>
          <button 
            onClick={() => navigate('/matches')}
            className="mt-4 text-sm text-rose-600 hover:text-rose-800"
          >
            Back to Matches
          </button>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-indigo-50">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
        >
          <div className="text-red-500 text-center mb-4 text-5xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-center text-gray-800">Chat Error</h2>
          <div className="text-gray-600 text-center mb-6 overflow-auto max-h-40">
            <p>{error}</p>
            {error.includes('Not authenticated') && (
              <p className="mt-2 text-sm text-rose-600">
                Your session may have expired. Try refreshing the page or logging in again.
              </p>
            )}
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors duration-300"
            >
              Retry
            </button>
            <button 
              onClick={() => navigate('/matches')}
              className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-300"
            >
              Back to Matches
            </button>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="w-full py-2 text-sm text-rose-600 hover:text-rose-800 transition-colors duration-300"
            >
              Log Out
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  let partner;
  if (chat.participants && chat.participants.length > 0) {
    const currentUserId = localStorage.getItem('userId');
    partner = chat.participants.find(p => p._id !== currentUserId);
    

    if (!partner && chat.messages && chat.messages.length > 0) {
      const firstMessageSender = chat.messages[0].sender;
      if (firstMessageSender._id !== currentUserId) {
        partner = firstMessageSender;
      }
    }
  } else if (chat.match && chat.match.users) {
    const currentUserId = localStorage.getItem('userId');
    partner = chat.match.users.find(u => u._id !== currentUserId);
  }
  
  // Use extracted partner or a friendly fallback name
  const chatPartner = partner || { 
    username: chat.otherUsername || "Your Match",
    _id: id
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Chat header */}
        <div className="bg-white shadow-md p-4 rounded-b-xl sticky top-0 z-10">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/matches')}
              className="p-2 rounded-full hover:bg-gray-100 mr-2 transition-colors duration-200"
            >
              <IoArrowBack className="text-gray-600 text-xl" />
            </button>
            
            <div className="w-12 h-12 rounded-full flex-shrink-0 mr-3 overflow-hidden" 
                 style={{ background: stringToColor(chatPartner.username) }}>
              <div className="w-full h-full flex items-center justify-center text-white font-bold">
                {getInitials(chatPartner.username)}
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="font-bold text-gray-800">{chatPartner.username}</h2>
              <p className="text-xs text-gray-500">
                {typing ? 
                  <span className="text-green-500 flex items-center">
                    typing<span className="animate-pulse">.</span><span className="animate-pulse delay-100">.</span><span className="animate-pulse delay-200">.</span>
                  </span> : 
                  'Online'
                }
              </p>
            </div>
            
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <IoEllipsisVertical className="text-gray-600 text-xl" />
            </button>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {chat.messages.length > 0 ? (
              chat.messages.map((msg, index) => {
                const userId = localStorage.getItem('userId');
                const isCurrentUser = msg.sender._id === userId;
                const prevMsg = index > 0 ? chat.messages[index - 1] : null;
                const showSender = !prevMsg || prevMsg.sender._id !== msg.sender._id;
                
                return (
                  <motion.div
                    key={msg.clientId || `msg-${msg._id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] ${msg.pending ? 'opacity-70' : ''}`}>
                      {!isCurrentUser && showSender && (
                        <div className="flex items-center mb-1 space-x-2">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
                            style={{ background: stringToColor(chatPartner.username) }}
                          >
                            {getInitials(chatPartner.username)}
                          </div>
                          <span className="text-xs text-gray-500">{chatPartner.username}</span>
                        </div>
                      )}
                      
                      <div 
                        className={`rounded-2xl p-3 ${
                        isCurrentUser 
                          ? 'bg-rose-600 text-white rounded-tr-none' 
                          : 'bg-gray-100 text-gray-800 rounded-tl-none'
                      } ${msg.error ? 'border-2 border-red-300 cursor-pointer' : ''}`}
                        onClick={() => msg.error ? handleRetryMessage(msg) : null}
                      >
                        {msg.content}
                        <div className={`text-xs mt-1 text-right ${
                          isCurrentUser ? 'text-rose-200' : 'text-gray-500'
                        }`}>
                          {msg.pending 
                            ? 'Sending...' 
                            : msg.error 
                              ? <span className="text-red-300">Failed to send - tap to retry</span>
                              : renderMessageTime(msg.timestamp)
                          }
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-6 bg-white rounded-xl shadow-sm"
                >
                  <div className="mx-auto w-16 h-16 mb-4 text-rose-400">
                    <IoHeart className="w-full h-full" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Start a conversation</h3>
                  <p className="text-gray-600">Say hello to your new match!</p>
                </motion.div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>
        
        {/* Message input */}
        <div className="bg-white p-4 rounded-t-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <IoAttach className="text-xl" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="w-full py-3 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-300"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600"
              >
                <IoHappy className="text-xl" />
              </button>
            </div>
            
            <motion.button
              type="submit"
              disabled={sendingMessage || !message.trim()}
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-full shadow-md ${
                sendingMessage || !message.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              } transition-colors duration-200`}
            >
              <IoSend className={`text-xl ${sendingMessage || !message.trim() ? 'text-gray-500' : 'text-white'}`} />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;