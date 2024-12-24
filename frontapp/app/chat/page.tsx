"use client";

import React, { useState } from 'react';
import ChatComponent from './components/Chat';
import ReturnButton from "../dashboard/components/ReturnButton";
import MultiUserSearchBar from './components/MultiUserSearchBar';
import axiosInstance from '../_utils/axiosInstance';
import { toast } from 'react-toastify'; // Ensure toast is imported

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserSelect = async (users) => {
    if (users.length === 0) return;

    try {
      const response = await axiosInstance.post('/chat', {
        users: users.map(user => user._id),
        isGroup: users.length > 1,
        name: users.length > 1 ? `Group Chat (${users.map(u => u.username).join(', ')})` : undefined
      });
      
      setActiveChat(response.data._id);
      
      // If it's a one-on-one chat, set the selected user ID
      if (users.length === 1) {
        setSelectedUserId(users[0]._id);
      } else {
        setSelectedUserId(null); // Reset for group chats
      }

      toast.success('Chat created successfully!');
    } catch (error) {
      console.error('Failed to create chat:', error);
      toast.error('Failed to create chat.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 mt-16">
      <div className="p-4 border-b bg-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between space-x-4">
          <h1 className="text-2xl font-bold shrink-0">Messages</h1>
          <div className="flex-1 z-50">
            <MultiUserSearchBar onUserSelect={handleUserSelect} />
          </div>
          <ReturnButton />
        </div>
      </div>
      <div className="flex-1 max-w-6xl mx-auto w-full p-4">
        <div className="bg-white rounded-lg shadow-lg h-full">
          <ChatComponent selectedUserId={selectedUserId} activeChat={activeChat} />
          
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
