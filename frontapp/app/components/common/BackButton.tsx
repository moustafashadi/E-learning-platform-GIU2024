// /components/Common/BackButton.tsx
import React from 'react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
    >
      Back
    </button>
  );
};

export default BackButton;
