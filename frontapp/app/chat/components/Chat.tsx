"use client";

import React, { useEffect, useState } from "react";
import WebSocketService from "../../_utils/websocket.service";

const ChatComponent: React.FC<{ selectedUserId: string | null }> = ({ selectedUserId }) => {
  if (!selectedUserId) {
    return <p>Please select a user to start chatting.</p>;
  }

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const socket = WebSocketService.connect(selectedUserId);

    socket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      WebSocketService.disconnect();
    };
  }, [selectedUserId]);

  

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
          disabled={!selectedUserId}
        />
        <button
          className="ml-2 bg-blue-600 text-white rounded p-2"
          disabled={!selectedUserId}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;