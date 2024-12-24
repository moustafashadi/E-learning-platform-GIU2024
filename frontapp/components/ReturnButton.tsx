"use client";

import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';

const ReturnButton = () => {
    const router = useRouter();

    const handleReturn = () => {
        router.replace('/dashboard'); // Using replace instead of push
    };

    return (
        <button
            onClick={handleReturn}
            className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
            aria-label="Return to Dashboard"
        >
            <IoArrowBack className="w-6 h-6" />
        </button>
    );
};

export default ReturnButton;