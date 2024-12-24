// /components/Course/ModuleCard.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import TakeQuizButton from '../Common/TakeQuizButton';

interface ModuleCardProps {
  module: {
    id: string;
    title: string;
    pmScore: number;
    difficulty: string;
  };
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const router = useRouter();

  const handleOpenModule = () => {
    router.push(`/course/module/${module.id}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col">
      <h4 className="text-lg font-semibold mb-2">{module.title}</h4>
      <span className="text-sm text-gray-700 mb-4">PM Score: {module.pmScore}</span>
      <div className="mt-auto flex space-x-4">
        <button
          onClick={handleOpenModule}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Open Module
        </button>
        <TakeQuizButton moduleId={module.id} />
      </div>
    </div>
  );
};

export default ModuleCard;
