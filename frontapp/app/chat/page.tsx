"use client";

import React, { useState, useEffect } from 'react';
import ChatComponent from './components/Chat';
import ReturnButton from "../dashboard/components/ReturnButton";
import UserSearchBar from './components/UserSearchBar';

const ChatPage = () => {
  const courseId = "your-course-id"; // Replace with the actual course ID you want to filter by
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  interface Message {
    // adjust these properties based on your actual message structure
    id?: string;
    content: string;
    senderId: string;
  }
  
  const [messages, setMessages] = useState<Message[]>([]);

  const handleUserSelect = (userId: string) => {
    console.log("Selected user ID:", userId);
    setSelectedUserId(userId); // Set the selected user ID for messaging
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/chat");
  
    ws.onopen = () => {
      console.log("WebSocket connection established");
    };
  
    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    return () => {
      ws.close();
    };
  }, []);

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