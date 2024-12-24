"use client";
import React, { useState } from 'react';
import { ChatComponent } from './components/Chat';
import ReturnButton from "../dashboard/components/ReturnButton";
import UserSearchBar from './components/UserSearchBar';
import axiosInstance from '../_utils/axiosInstance';

const ChatPage = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const handleUserSelect = async (userId: string) => {
    try {
      const response = await axiosInstance.post('/chat', {
        users: [userId],
        isGroup: false
      });
      setActiveChat(response.data._id);
      setSelectedUserId(userId);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 border-b bg-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Messages</h1>
          <div className="w-64">
            <UserSearchBar onUserSelect={handleUserSelect} />
          </div>
          <ReturnButton />
        </div>
      </div>
      <div className="flex-1 max-w-4xl mx-auto w-full bg-white shadow-lg rounded-lg my-4">
        <ChatComponent selectedUserId={selectedUserId} activeChat={activeChat} />
      </div>
    </div>
  );
};

export default ChatPage;