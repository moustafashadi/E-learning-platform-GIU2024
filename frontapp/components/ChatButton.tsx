"use client";

import { useRouter } from 'next/navigation';
import { BsChatDots } from 'react-icons/bs';

const ChatButton = () => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/chat')}
            className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
            aria-label="Open Chat"
        >
            <BsChatDots className="w-6 h-6" />
        </button>
    );
};

export default ChatButton;