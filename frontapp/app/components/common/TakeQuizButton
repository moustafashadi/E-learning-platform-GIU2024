// /components/Common/TakeQuizButton.tsx
import React from 'react';
import { useRouter } from 'next/navigation';

interface TakeQuizButtonProps {
  moduleSlug: string;
}

const TakeQuizButton = ({ moduleSlug }: TakeQuizButtonProps) => {
  const router = useRouter();

  const handleTakeQuiz = () => {
    router.push(`/quiz/${moduleSlug}`); // Adjust the path as per your routing
  };

  return (
    <button
      onClick={handleTakeQuiz}
      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
    >
      Take Quiz
    </button>
  );
};

export default TakeQuizButton;
