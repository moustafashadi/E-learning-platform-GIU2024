// /components/Course/EditNoteModal.tsx
import React, { useState } from 'react';

interface Note {
  _id: string;
  content: string;
}

interface EditNoteModalProps {
  note: Note;
  onSave: (updatedNote: Note) => void;
  onClose: () => void;
}

const EditNoteModal = ({ note, onSave, onClose }: EditNoteModalProps) => {
  const [editedContent, setEditedContent] = useState<string>(note.content);
  const [saving, setSaving] = useState<boolean>(false);

  const handleSave = async () => {
    if (!editedContent.trim()) {
      alert('Note content cannot be empty.');
      return;
    }
    setSaving(true);
    await onSave({ ...note, content: editedContent });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[400px]">
        <h2 className="text-xl font-bold mb-4">Edit Note</h2>
        <textarea
          className="w-full p-2 border rounded-md mb-4"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={4}
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModal;
