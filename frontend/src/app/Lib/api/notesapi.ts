const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

interface Note {
  _id: string;
  courseId: string;
  content: string;
  userId: string;
  isPinned: boolean;
  created_at: string;
  last_updated: string;
}

interface CreateNoteRequest {
  content: string;
}

interface UpdateNoteRequest {
  content?: string;
  isPinned?: boolean;
}

// This assumes you have a way of getting the JWT token from the frontend environment (e.g., localStorage, cookies).
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Corresponds to @Post(':courseId') in NotesController
export async function createNote(courseId: string, content: string): Promise<Note> {
  const res = await fetch(`${'http://localhost:3000'}/notes/${courseId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create note: ${res.statusText}`);
  }
  return res.json();
}

// Corresponds to @Get('/') in NotesController
export async function getAllNotes(): Promise<Note[]> {
  const res = await fetch(`${'http://localhost:3000'}/notes`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch notes: ${res.statusText}`);
  }
  const data = await res.json();
  return data.notes;
}

// Corresponds to @Get(':id') in NotesController
export async function getNoteById(noteId: string): Promise<Note> {
  const res = await fetch(`${'http://localhost:3000'}/notes/${noteId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch note: ${res.statusText}`);
  }
  const data = await res.json();
  return data.note;
}

// Corresponds to @Put(':id') in NotesController
export async function updateNote(noteId: string, updateData: UpdateNoteRequest): Promise<Note> {
  const res = await fetch(`${'http://localhost:3000'}/notes/${noteId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });
  if (!res.ok) {
    throw new Error(`Failed to update note: ${res.statusText}`);
  }
  const data = await res.json();
  return data.note;
}

// Corresponds to @Delete(':id') in NotesController
export async function deleteNote(noteId: string): Promise<void> {
  const res = await fetch(`${'http://localhost:3000'}/notes/${noteId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to delete note: ${res.statusText}`);
  }
}
