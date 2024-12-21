"use client";

import React from "react";
import ChatComponent from "./components/Chat";
import ReturnButton from "../dashboard/components/ReturnButton";

const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Chat Page</h1>
      <ChatComponent />
      <ReturnButton />
    </div>
  );
};

export default ChatPage;