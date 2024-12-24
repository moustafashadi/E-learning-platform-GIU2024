// /components/Course/EditNoteModal.tsx
import React, { useState } from 'react';
import { Note } from '@/app/types/note';

interface EditNoteModalProps {
  note: Note;
  onSave: (updatedNote: Note) => Promise<void>; // Updated to return Promise<void>
  onClose: () => void;
}

const EditNoteModal = ({ note, onSave, onClose }: EditNoteModalProps) => {
  const [content, setContent] = useState(note.content);
  const [isPinned, setIsPinned] = useState(note.isPinned);

  const handleSubmit = async () => {
    const updatedNote: Note = {
      ...note,
      content,
      isPinned,
      // Optionally, update last_updated if needed
    };
    await onSave(updatedNote);
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[500px]">
        <h2 className="text-2xl font-bold mb-4">Edit Note</h2>
        <label className="block mb-4">
          Content:
          <textarea
            className="w-full p-2 border rounded-md mt-1"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
        </label>
        <label className="block mb-4">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="mr-2"
          />
          Pin this note
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModal;
