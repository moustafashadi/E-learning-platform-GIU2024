// /components/Course/CreateForumModal.tsx
import React, { useState } from 'react';

interface CreateForumModalProps {
  onCreate: (title: string, tag: string, content: string) => void;
  onClose: () => void;
}

const CreateForumModal = ({ onCreate, onClose }: CreateForumModalProps) => {
  const [title, setTitle] = useState<string>('');
  const [tag, setTag] = useState<string>('Question');
  const [content, setContent] = useState<string>('');

  const handleSubmit = () => {
    if (!title || !content) {
      alert('Title and Content are required.');
      return;
    }
    onCreate(title, tag, content);
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[500px]">
        <h2 className="text-2xl font-bold mb-4">Create New Forum Post</h2>
        <label className="block mb-4">
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
          />
        </label>
        <label className="block mb-4">
          Tag:
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
          >
            <option value="Helpful">Helpful</option>
            <option value="Frequent Questions">Frequent Questions</option>
            <option value="Question">Question</option>
            <option value="Answer">Answer</option>
            <option value="Announcement">Announcement</option>
          </select>
        </label>
        <label className="block mb-4">
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
            rows={4}
          />
        </label>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateForumModal;
