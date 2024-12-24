import React, { useState, useEffect } from 'react';
import { Chat, Message } from '../interfaces/chat.interface';
import axiosInstance from '../../_utils/axiosInstance';

interface ChatComponentProps {
  selectedUserId: string | null;
  activeChat: string | null;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({ selectedUserId, activeChat }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosInstance.get('/chat');
        setChats(response.data);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeChat) {
      const chat = chats.find(c => c._id === activeChat);
      if (chat) setCurrentChat(chat);
    }
  }, [activeChat, chats]);

  const sendMessage = async () => {
    if (!message.trim() || !currentChat) return;

    try {
      await axiosInstance.post('/messages', {
        chatId: currentChat._id,
        content: message,
        timestamp: new Date(),
      });

      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setCurrentChat(chat)}
            className={`p-4 hover:bg-gray-100 cursor-pointer ${
              currentChat?._id === chat._id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="font-medium">
              {chat.isGroup ? chat.name : chat.users.find(u => u._id !== selectedUserId)?.username}
            </div>
            {chat.messages[0] && (
              <div className="text-sm text-gray-500 truncate">
                {chat.messages[0].content}
              </div>
            )}
          </div>
        ))}
      </div>
      {currentChat ? (
        <div className="w-2/3 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-medium">
              {currentChat.isGroup 
                ? currentChat.name 
                : currentChat.users.find(u => u._id !== selectedUserId)?.username}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {currentChat.messages.map((msg: Message) => (
              <div 
                key={msg._id} 
                className={`mb-4 ${msg.senderId._id === selectedUserId ? 'text-right' : ''}`}
              >
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
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 p-2 border rounded-full"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-2/3 flex items-center justify-center text-gray-500">
          Select a chat or search for a user to start messaging
        </div>
      )}
    </div>
  );
};