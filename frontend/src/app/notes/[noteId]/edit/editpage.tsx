import React, { useEffect, useState } from 'react';
import { getNoteById, updateNote } from '../../../Lib/api/notesapi';

interface Props {
  params: { noteId: string };
}

export default function EditNotePage({ params }: Props) {
  const { noteId } = params;
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchNote() {
      try {
        const data = await getNoteById(noteId);
        setContent(data.content);
      } catch (err: any) {
        setMessage(`Error fetching note: ${err.message}`);
      }
    }
    fetchNote();
  }, [noteId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const updated = await updateNote(noteId, { content });
      setMessage('Note updated successfully!');
    } catch (err: any) {
      setMessage(`Error updating note: ${err.message}`);
    }
  }

  return (
    <div>
      <h1>Edit Note</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
