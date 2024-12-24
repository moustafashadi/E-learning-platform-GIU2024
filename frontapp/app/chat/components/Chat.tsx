import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../_utils/axiosInstance';

interface Message {
  _id: string;
  content: string;
  senderId: {
    _id: string;
    username: string;
  } | string; // Allow for both object and string types
  timestamp: string;
  chatId?: string;
}

interface Chat {
  _id: string;
  users: Array<{
    _id: string;
    username: string;
    email: string;
  }>;
  messages: Message[];
  isGroup: boolean;
  name?: string;
}

const ChatComponent = ({ selectedUserId, activeChat }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentChatIdRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const fetchCurrentChatMessages = async (chatId: string) => {
    try {
      const response = await axiosInstance.get(`/chat/${chatId}`);
      const updatedChat = Array.isArray(response.data) 
        ? response.data.find((chat: Chat) => chat._id === chatId)
        : response.data;
        
     if (updatedChat) {
        // Normalize the messages to ensure consistent structure
        const normalizedMessages = updatedChat.messages.map((msg: any) => ({
          ...msg,
          senderId: typeof msg.senderId === 'string' || typeof msg.senderId === 'object' && !msg.senderId.username
            ? {
                _id: typeof msg.senderId === 'string' ? msg.senderId : msg.senderId.$oid || msg.senderId._id,
                username: 'User' // Default username if not provided
              }
            : msg.senderId
        }));

        const normalizedChat = {
          ...updatedChat,
          messages: normalizedMessages
        };

        setCurrentChat(normalizedChat);
        setChats(prevChats =>
          prevChats.map(chat =>
            chat._id === chatId ? { ...chat, messages: normalizedMessages } : chat
          )
        );
      }
    } catch (err) {
      console.error('Failed to fetch chat messages:', err);
    }
  };


  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/chat/${selectedUserId}`);
        setChats(response.data);
        
        const chatToSelect = activeChat || currentChatIdRef.current;
        if (chatToSelect) {
          const activeChatData = response.data.find((chat: Chat) => chat._id === chatToSelect);
          if (activeChatData) {
            setCurrentChat(activeChatData);
            currentChatIdRef.current = activeChatData._id;
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch chats:', err);
        setError('Could not load chats');
      } finally {
        setLoading(false);
      }
    };

    if (selectedUserId) {
      fetchChats();
    }
  }, [selectedUserId, activeChat]);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    
    if (currentChat?._id) {
      currentChatIdRef.current = currentChat._id;
      fetchCurrentChatMessages(currentChat._id);
      
      pollInterval = setInterval(() => {
        if (currentChatIdRef.current) {
          fetchCurrentChatMessages(currentChatIdRef.current);
        }
      }, 5000);
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [currentChat?._id]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChat?._id || !selectedUserId) return;

    try {
      // Create the message with the correct format
      const messageData = {
        chatId: currentChat._id,
        content: message.trim(),
        senderId: selectedUserId
      };

      // Send message
      await axiosInstance.post('/messages', messageData);

      // Clear input
      setMessage('');

      // Immediately fetch updated messages
      await fetchCurrentChatMessages(currentChat._id);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Could not send message');
    }
  };

  const handleChatSelect = (chat: Chat) => {
    setCurrentChat(chat);
    currentChatIdRef.current = chat._id;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading chats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const getChatName = (chat: Chat) => {
    if (chat.isGroup) return chat.name;
    const otherUser = chat.users.find(u => u._id !== selectedUserId);
    return otherUser?.username || 'Unknown User';
  };

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => handleChatSelect(chat)}
            className={`p-4 hover:bg-gray-100 cursor-pointer ${
              currentChat?._id === chat._id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="font-medium">{getChatName(chat)}</div>
            {chat.messages?.length > 0 && (
              <div className="text-sm text-gray-500 truncate">
                {chat.messages[chat.messages.length - 1].content}
              </div>
            )}
          </div>
        ))}
        {chats.length === 0 && (
          <div className="p-4 text-gray-500 text-center">
            No chats available
          </div>
        )}
      </div>

      <div className="w-2/3 flex flex-col">
        {currentChat ? (
          <>
            <div className="p-4 border-b">
              <h2 className="font-medium">{getChatName(currentChat)}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {currentChat.messages?.map((msg) => (
                <div 
                  key={msg._id} 
                  className={`mb-4 ${msg.senderId._id === selectedUserId ? 'text-right' : ''}`}
                >
                  <div className="mb-1 text-xs text-gray-500">
                    {msg.senderId.username}
                  </div>
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      msg.senderId._id === selectedUserId
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
              {(!currentChat.messages || currentChat.messages.length === 0) && (
                <div className="text-center text-gray-500">
                  No messages yet
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;