"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PencilIcon } from "@heroicons/react/24/solid"; // Import the pen icon

const ChatButton: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/chat"); // Navigate to the chat page
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition"
    >
      <PencilIcon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
};

export default ChatButton; 