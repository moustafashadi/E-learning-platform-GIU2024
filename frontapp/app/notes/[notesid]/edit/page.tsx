"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchNoteById, updateNote } from '../../../Lib/api/notesapi';

const EditNotePage = () => {
  const router = useRouter();
  const { notesid } = router.query;
  const [content, setContent] = useState('');

  useEffect(() => {
    const getNote = async () => {
      if (notesid) {
        const note = await fetchNoteById(notesid as string);
        setContent(note.content);
      }
    };
    getNote();
  }, [notesid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateNote(notesid as string, { content });
      alert('Note updated successfully!');
      router.push('/notes');
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Edit Note</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditNotePage;
