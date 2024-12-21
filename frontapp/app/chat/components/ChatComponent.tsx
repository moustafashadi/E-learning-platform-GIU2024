"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("/chats");
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  const handleSendMessage = async () => {
    if (input.trim() && chatId) {
      try {
        const newMessage = { content: input, chatId };
        await axios.post("/chats", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInput("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((message, index) => (
          <div key={index} className="mb-2 p-2 bg-blue-500 text-white rounded">
            {message.content}
          </div>
        ))}
      </div>
      <div className="flex p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-600 text-white rounded p-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent; 