'use client';

import React, { useEffect, useState } from 'react';
import { getNoteById, deleteNote } from '../../Lib/api/notesapi';

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
        const data = await getNoteById(noteId);
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

  if (error) return <p style={{color:'red'}}>{error}</p>;
  if (!note) return <p>Loading...</p>;

  return (
    <div>
      <h1>Note Details</h1>
      <p><strong>Content:</strong> {note.content}</p>
      <p><strong>Course ID:</strong> {note.courseId}</p>
      <a href={`/notes/${note._id}/edit`}>Edit</a>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
