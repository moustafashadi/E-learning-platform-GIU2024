import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/notes'; 

export const fetchNotes = async () => {
  const response = await axios.get(`${API_BASE_URL}/`);
  return response.data.notes;
};

export const fetchNoteById = async (noteId: string) => {
  const response = await axios.get(`${API_BASE_URL}/${noteId}`);
  return response.data.note;
};

export const createNote = async (courseId: string, content: string) => {
  const response = await axios.post(`${API_BASE_URL}/${courseId}`, { content });
  return response.data;
};

export const updateNote = async (noteId: string, updateData: Record<string, any>) => {
  const response = await axios.put(`${API_BASE_URL}/${noteId}`, updateData);
  return response.data;
};

export const deleteNote = async (noteId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/${noteId}`);
  return response.data;
};
