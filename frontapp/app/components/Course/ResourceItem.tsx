// /components/Course/ResourceItem.tsx
import React from 'react';

interface Resource {
  id: string;
  name: string;
  url: string;
}

interface ResourceItemProps {
  resource: Resource;
}

const ResourceItem = ({ resource }: ResourceItemProps) => {
  const handleOpenResource = () => {
    window.open(resource.url, '_blank');
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <span>{resource.name}</span>
      <button
        onClick={handleOpenResource}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Open
      </button>
    </div>
  );
};

export default ResourceItem;
