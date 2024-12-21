"use client";

import React, { useState } from 'react';
import ChatComponent from './components/Chat';
import ReturnButton from "../dashboard/components/ReturnButton";
import UserSearchBar from './components/UserSearchBar';

const ChatPage = () => {
  const courseId = "your-course-id"; // Replace with the actual course ID you want to filter by
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleUserSelect = (userId: string) => {
    console.log("Selected user ID:", userId);
    setSelectedUserId(userId); // Set the selected user ID for messaging
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Chat Page</h1>
      <UserSearchBar onUserSelect={handleUserSelect} courseId={courseId} />
      <ChatComponent selectedUserId={selectedUserId} />
      <ReturnButton />
    </div>
  );
};

export default ChatPage;