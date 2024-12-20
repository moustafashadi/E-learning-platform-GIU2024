"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNote } from '../../Lib/api/notesapi';

const CreateNotePage = () => {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [courseId, setCourseId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNote(courseId, content);
      alert('Note created successfully!');
      setContent('');
      setCourseId('');
      router.push('/notes');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Create Note</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="courseId" className="block mb-2">Course ID:</label>
          <input
            type="text"
            id="courseId"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block mb-2">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            rows={4}
            required
          ></textarea>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
          Create Note
        </button>
      </form>
    </div>
  );
};

export default CreateNotePage;
