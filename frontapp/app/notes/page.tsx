"use client";

import { useEffect, useState } from 'react';
import { fetchNotes } from '../Lib/api/notesapi';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    try {
      const fetchedNotes = await fetchNotes();
      setNotes(fetchedNotes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-screen p-8">Loading notes...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Notes</h1>
      {notes.length > 0 ? (
        <ul className="space-y-4">
          {notes.map((note: any) => (
            <li key={note._id} className="p-4 bg-gray-800 rounded shadow">
              <p>{note.content}</p>
              <p className="text-sm text-gray-400">Last Updated: {new Date(note.last_updated).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
};

export default NotesPage;
