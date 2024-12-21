"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../_utils/axiosInstance"; // Corrected import path
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

// Define the type for a note
interface Note {
  _id: string;
  content: string;
  last_updated: string;
  courseTitle: string; // Adjusted to match the backend
}

interface NotesProps {
  courseId: string; // Course ID passed as a prop
}

function Notes({ courseId }: NotesProps) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]); // Explicitly define the type
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setRole(response.data.user.role);
      } catch (error) {
        toast.error("You must be logged in to access the notes.");
        router.push("/login");
      }
    };

    const fetchNotes = async () => {
      try {
        // Include the course ID in the endpoint
        const response = await axiosInstance.get(`/notes?courseId=${courseId}`);
        setNotes(response.data.notes);
      } catch (error) {
        toast.error("Failed to load notes.");
      }
    };

    if (isAuthenticated) {
      fetchUserRole();
      fetchNotes();
    } else if (!loading) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router, courseId]);

  const handleCreateNote = async () => {
    const content = prompt("Enter note content:");
    if (content) {
      try {
        // Use the course ID in the API endpoint
        const response = await axiosInstance.post(`/notes/${courseId}`, {
          content,
        });
        setNotes((prevNotes) => [...prevNotes, response.data]); // Update notes correctly
        toast.success("Note created successfully.");
      } catch (error) {
        toast.error("Failed to create note.");
      }
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await axiosInstance.delete(`/notes/${noteId}`);
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== noteId)
        ); // Correct filter function
        toast.success("Note deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete note.");
      }
    }
  };

  const handleEditNote = async (noteId: string, currentContent: string) => {
    const newContent = prompt("Edit your note content:", currentContent);
    if (newContent && newContent !== currentContent) {
      try {
        const response = await axiosInstance.put(`/notes/${noteId}`, {
          content: newContent,
        });
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === noteId
              ? { ...note, content: response.data.note.content, last_updated: response.data.note.last_updated }
              : note
          )
        );
        toast.success("Note updated successfully.");
      } catch (error) {
        console.error('Error updating note:', error); // Log error for debugging
        toast.error("Failed to update note.");
      }
    }
  };
  

  const renderNotes = () => {
    if (notes.length === 0) {
      return <p className="text-lg font-semibold text-center">No notes found.</p>;
    }

    return (
      <ul className="space-y-4">
        {notes.map((note) => (
          <li
            key={note._id}
            className="p-4 bg-blue-800 text-white rounded shadow"
          >
            <p>
              <strong>{note.courseTitle || "Unknown Course"}:</strong> {note.content}
            </p>
            <p className="text-sm text-blue-400">
              Last Updated: {new Date(note.last_updated).toLocaleString()}
            </p>
            <div className="mt-2 space-x-2">
              <button
                className="text-yellow-500"
                onClick={() => handleEditNote(note._id, note.content)}
              >
                Edit
              </button>
              <button
                className="text-red-500"
                onClick={() => handleDeleteNote(note._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <aside className="w-64 p-4 bg-gray-800 text-white">
        <h2 className="text-2xl font-bold mb-4">Actions</h2>
        <button
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded mb-2"
          onClick={handleCreateNote}
        >
          Create Note
        </button>
      </aside>
      <main className="flex-1 p-6 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Notes</h1>
        {renderNotes()}
      </main>
    </div>
  );
}

export default Notes;
