// Updated page.tsx
"use client";
import React, { useState } from 'react';
import { ChatComponent } from './components/Chat';
import ReturnButton from "../dashboard/components/ReturnButton";
import MultiUserSearchBar from './components/MultiUserSearchBar';
import axiosInstance from '../_utils/axiosInstance';

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const handleUserSelect = async (userIds: string[]) => {
    try {
      const response = await axiosInstance.post('/chat', {
        users: userIds,
        isGroup: userIds.length > 1,
        name: userIds.length > 1 ? `Group Chat (${userIds.length})` : undefined
      });
      setActiveChat(response.data._id);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 border-b bg-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Messages</h1>
          <MultiUserSearchBar onUserSelect={handleUserSelect} />
          <ReturnButton />
        </div>
        
      </div>
      <div className="flex-1 max-w-4xl mx-auto w-full bg-white shadow-lg rounded-lg my-4">
      <ChatComponent activeChat={activeChat} selectedUserId={null} />
      </div>
    </div>
  );
};

export default ChatPage;