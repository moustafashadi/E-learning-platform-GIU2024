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
    <div className="flex flex-col h-screen bg-gray-100 mt-16"> {/* Added mt-16 for navbar space */}
      <div className="p-4 border-b bg-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between space-x-4">
          <h1 className="text-2xl font-bold shrink-0">Messages</h1>
          <div className="flex-1 z-50"> {/* Added z-50 to ensure visibility */}
            <MultiUserSearchBar onUserSelect={handleUserSelect} />
          </div>
          <ReturnButton />
        </div>
      </div>
      <div className="flex-1">
        <ChatComponent selectedUserId={null} activeChat={activeChat} />
      </div>
    </div>
  );
};

export default ChatPage;