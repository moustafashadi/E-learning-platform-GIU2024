'use client';

import React, { useEffect, useState } from 'react';
import { getAllNotes } from '../Lib/api/notesapi';


export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNotes() {
      try {
        const data = await getAllNotes();
        setNotes(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchNotes();
  }, []);

  return (
    <div>
      <h1>All Notes</h1>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            <a href={`/notes/${note._id}`}>{note.content}</a>
          </li>
        ))}
      </ul>
      <a href="/notes/create">Create a new note</a>
    </div>
  );
}
