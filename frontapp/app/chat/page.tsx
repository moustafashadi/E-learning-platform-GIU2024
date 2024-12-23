"use client";

import React, { useState, useEffect } from 'react';
import ChatComponent from './components/Chat';
import ReturnButton from "../dashboard/components/ReturnButton";
import UserSearchBar from './components/UserSearchBar';

const ChatPage = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleUserSelect = (userId: string) => {
    console.log("Selected user ID:", userId);
    setSelectedUserId(userId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Chat Page</h1>
      <UserSearchBar onUserSelect={handleUserSelect} />
      <ChatComponent selectedUserId={selectedUserId} />
      <ReturnButton />
    </div>
  );
};

export default ChatPage;