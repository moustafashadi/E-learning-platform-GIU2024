"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatComponent: React.FC<{ selectedUserId: string | null }> = ({ selectedUserId }) => {
  if (!selectedUserId) {
    return <p>Please select a user to start chatting.</p>;
  }

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/chat");
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
    if (input.trim() && selectedUserId) {
      const message = { content: input, recipientId: selectedUserId };
      socket?.send(JSON.stringify(message));
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2>Chat with User ID: {selectedUserId}</h2>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 p-2 rounded ${message.senderId === selectedUserId ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}>
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
          disabled={!selectedUserId} // Disable input if no user is selected
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-600 text-white rounded p-2"
          disabled={!selectedUserId} // Disable button if no user is selected
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;