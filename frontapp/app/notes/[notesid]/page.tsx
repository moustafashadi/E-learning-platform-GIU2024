'use client';

import React, { useEffect, useState } from 'react';
import { fetchNoteById, deleteNote } from '../../Lib/api/notesapi';

interface Props {
  params: { noteId: string };
}

export default function NoteDetailPage({ params }: Props) {
  const { noteId } = params;
  const [note, setNote] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNote() {
      try {
        const data = await fetchNoteById(noteId);
        setNote(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchNote();
  }, [noteId]);

  async function handleDelete() {
    try {
      await deleteNote(noteId);
      window.location.href = '/notes'; // redirect after deletion
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!note) return <p>Loading...</p>;

  return (
    <div>
      <h1>Note Details</h1>
      <p><strong>Content:</strong> {note.content}</p>
      <p><strong>Course ID:</strong> {note.courseId}</p>

      {/* Edit Link */}
      <a href={`/notes/${note._id}/edit`} style={{ marginRight: '10px' }}>Edit</a>

      {/* Delete Link */}
      <a href={`/notes/${note._id}/delete`} style={{ color: 'red', marginRight: '10px' }}>
        Delete Note
      </a>

      {/* Existing Delete Button */}
      <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
        Delete (Direct)
      </button>
    </div>
  );
}
