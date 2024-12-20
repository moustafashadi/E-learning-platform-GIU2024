"use client";

import { useRouter } from 'next/router';
import { deleteNote } from '../../../Lib/api/notesapi';

const DeleteNotePage = () => {
  const router = useRouter();
  const { notesid } = router.query;

  const handleDelete = async () => {
    try {
      await deleteNote(notesid as string);
      alert('Note deleted successfully!');
      router.push('/notes');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Delete Note</h1>
      <p>Are you sure you want to delete this note?</p>
      <div className="mt-4">
        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 mr-4">
          Yes, Delete
        </button>
        <button onClick={() => router.push('/notes')} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteNotePage;
