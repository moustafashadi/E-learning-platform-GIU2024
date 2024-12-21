"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../_utils/axiosInstance"; // Corrected import path
import toast from "react-hot-toast";
import Sidebar from "../../dashboard/components/Sidebar";
import useAuth from "../../hooks/useAuth";

function Notes() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [notes, setNotes] = useState([]);
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
        const response = await axiosInstance.get("/notes");
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
  }, [isAuthenticated, loading, router]);

  const renderNotes = () => {
    if (notes.length === 0) {
      return <p className="text-lg font-semibold text-center">No notes found.</p>;
    }

    return (
      <ul className="space-y-4">
        {notes.map((note: any) => (
          <li
            key={note._id}
            className="p-4 bg-gray-800 text-white rounded shadow"
          >
            <p>{note.content}</p>
            <p className="text-sm text-gray-400">
              Last Updated: {new Date(note.last_updated).toLocaleString()}
            </p>
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
      {role && <Sidebar role={role} />}
      <main className="flex-1 p-6 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Notes</h1>
        {renderNotes()}
      </main>
    </div>
  );
}

export default Notes;
