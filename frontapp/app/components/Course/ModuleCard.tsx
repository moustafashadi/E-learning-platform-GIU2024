// /components/Course/ModuleCard.tsx

import React from 'react';
import { Module } from '@/app/types';
import { useRouter } from 'next/navigation';

interface ModuleCardProps {
  module: Module;
}

const ModuleCard = ({ module }: ModuleCardProps) => {
  const router = useRouter();

  const handleViewModule = () => {
    if (!module._id) {
      console.error('Module ID is undefined.');
      return;
    }
    console.log(`Navigating to module: ${module._id}`);
    router.push(`/module/${module._id}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 flex flex-col">
      <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
      <p className="text-gray-600 mb-4">Difficulty: {module.difficulty}</p>
      <p className="text-gray-700 mb-4">Progress: {module.pmScore}%</p>
      <button
        onClick={handleViewModule}
        className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        View Module
      </button>
    </div>
  );
};

export default ModuleCard;
