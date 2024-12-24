// /app/course/module/[moduleSlug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/app/_utils/axiosInstance';
import toast from 'react-hot-toast';
import BackButton from '@/app/components/common/BackButton';
import TakeQuizButton from '@/app/components/Course/TakeQuizButton';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import EditNoteModal from '@/app/components/Course/EditNoteModal';
import ResourceItem from '@/app/components/Course/ResourceItem';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';


interface Resource {
  id: string;
  name: string;
  url: string;
}

interface Note {
  _id: string;
  content: string;
  isPinned: boolean;
  created_at: string;
  last_updated: string;

}

interface Module {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
}

const ModulePage = () => {
  const { moduleSlug } = useParams();
  const router = useRouter();
  
  // Fetch userId from Redux store if needed (e.g., for associating notes)
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  
  const [loading, setLoading] = useState(true);
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [creatingNote, setCreatingNote] = useState(false);

  useEffect(() => {
    if (!moduleSlug) return;

    const fetchModuleDetails = async () => {
      setLoading(true);
      try {
        // Fetch module details
        const moduleResp = await axiosInstance.get(`/modules/slug/${moduleSlug}`, {
          withCredentials: true,
        });
        setModuleData(moduleResp.data);

        // Fetch resources
        const resourcesResp = await axiosInstance.get(`/modules/slug/${moduleSlug}/resources`, {
          withCredentials: true,
        });
        setResources(resourcesResp.data);

        // Fetch student notes
        const notesResp = await axiosInstance.get(`/notes/module/${moduleSlug}`, {
          withCredentials: true,
        });
        setNotes(notesResp.data.notes);
      } catch (err) {
        console.error('Failed to fetch module details:', err);
        toast.error('Failed to load module details.');
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [moduleSlug]);

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) {
      toast.error('Note content cannot be empty.');
      return;
    }

    setCreatingNote(true);
    try {
      const response = await axiosInstance.post(
        `/notes/module/${moduleSlug}`,
        { content: newNoteContent },
        { withCredentials: true }
      );
      setNotes((prev) => [...prev, response.data]);
      setNewNoteContent('');
      toast.success('Note added successfully.');
    } catch (error) {
      toast.error('Failed to add note.');
      console.error('Add Note Error:', error);
    } finally {
      setCreatingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await axiosInstance.delete(`/notes/${noteId}`, {
        withCredentials: true,
      });
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      toast.success('Note deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete note.');
      console.error('Delete Note Error:', error);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleSaveEditedNote = async (updatedNote: Note) => {
    try {
      const response = await axiosInstance.put(
        `/notes/${updatedNote._id}`,
        { content: updatedNote.content },
        { withCredentials: true }
      );
      setNotes((prev) =>
        prev.map((note) => (note._id === updatedNote._id ? response.data : note))
      );
      setEditingNote(null);
      toast.success('Note updated successfully.');
    } catch (error) {
      toast.error('Failed to update note.');
      console.error('Update Note Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="text-red-500 text-lg">Module not found.</p>
        <BackButton />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <BackButton />
      <h1 className="text-3xl font-bold mb-4">{moduleData.title}</h1>
      <div className="mb-6">
        {moduleSlug && typeof moduleSlug === 'string' && (
          <TakeQuizButton moduleSlug={moduleSlug} />
        )}
      </div>

      {/* Resources Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Resources</h2>
        {resources.length > 0 ? (
          <div className="space-y-4">
            {resources.map((resource) => (
              <ResourceItem key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No resources available for this module.</p>
        )}
      </section>

      {/* Notes Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Notes</h2>
        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note._id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              >
                <p className="text-gray-800">{note.content}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span>Created: {new Date(note.created_at).toLocaleString()}</span>
                  <span className="ml-4">Last Updated: {new Date(note.last_updated).toLocaleString()}</span>
                  <span className="ml-4">Pinned: {note.isPinned ? 'Yes' : 'No'}</span>
                </div>
                <div className="mt-2 flex space-x-4">
                  <button
                    onClick={() => handleEditNote(note)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No notes available. Add your first note!</p>
          )}
        </div>

        {/* Add Note Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Add a New Note</h3>
          <textarea
            className="w-full p-2 border rounded-md mb-2"
            placeholder="Enter note content..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            rows={3}
          />
          <button
            onClick={handleAddNote}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            disabled={creatingNote || !newNoteContent.trim()}
          >
            {creatingNote ? 'Adding Note...' : 'Add Note'}
          </button>
        </div>
      </section>

      {/* Edit Note Modal */}
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onSave={handleSaveEditedNote}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
};

export default ModulePage;
