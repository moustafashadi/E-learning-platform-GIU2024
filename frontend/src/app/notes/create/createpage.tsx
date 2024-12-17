'use client';

import React, { useState } from 'react';
import { createNote } from '../../Lib/api/notesapi';

export default function CreateNotePage() {
  const [courseId, setCourseId] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const note = await createNote(courseId, content);
      setMessage(`Note created with ID: ${note._id}`);
      setCourseId('');
      setContent('');
    } catch (error: any) {
      setMessage(`Error creating note: ${error.message}`);
    }
  }

  return (
    <div>
      <h1>Create Note</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course ID:</label>
          <input
            type="text"
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
