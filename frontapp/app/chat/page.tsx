"use client";

import React from "react";
import ChatComponent from "./components/ChatComponent";

const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Chat Page</h1>
      <ChatComponent />
    </div>
  );
};

export default ChatPage;
