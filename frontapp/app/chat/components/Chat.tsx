"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket("ws://localhost:3000/chat"); // Adjust the URL as necessary
    setSocket(ws);

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const message = { content: input }; // Adjust based on your message structure
      socket?.send(JSON.stringify(message)); // Send message via WebSocket
      setInput(""); // Clear input field
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((message, index) => (
          <div key={index} className="mb-2 p-2 bg-blue-500 text-white rounded">
            {message.content} {/* Adjust based on your message structure */}
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
