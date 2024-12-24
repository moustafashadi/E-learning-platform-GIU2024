// /app/forum/[courseSlug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';
import BackButton from '@/components/Common/BackButton';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import CreateForumModal from '@/components/Course/CreateForumModal';

interface Forum {
  _id: string;
  title: string;
  content: string;
  tag: string;
  createdBy: string;
  threads: any[]; // Define a proper type based on your schema
}

const ForumPage = () => {
  const { courseSlug } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [forums, setForums] = useState<Forum[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newForumTitle, setNewForumTitle] = useState('');
  const [newForumTag, setNewForumTag] = useState('Question');
  const [newForumContent, setNewForumContent] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!courseSlug) {
      toast.error('No course slug provided.');
      router.push('/dashboard');
      return;
    }

    const fetchForums = async () => {
      setLoading(true);
      try {
        // Fetch user ID
        const userResp = await axiosInstance.get('/auth/me', {
          withCredentials: true,
        });
        setUserId(userResp.data.id);

        // Fetch forums for the course
        const resp = await axiosInstance.get(`/courses/slug/${courseSlug}/forums`, {
          withCredentials: true,
        });
        setForums(resp.data);
      } catch (err) {
        console.error('Failed to fetch forums:', err);
        toast.error('Failed to load forums.');
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, [courseSlug, router]);

  const handleCreateForum = async () => {
    if (!newForumTitle || !newForumContent) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      await axiosInstance.post(
        `/courses/slug/${courseSlug}/forum`,
        {
          title: newForumTitle,
          content: newForumContent,
          tag: newForumTag,
          createdBy: userId,
        },
        { withCredentials: true }
      );
      toast.success('Forum created successfully.');
      setShowCreateModal(false);
      setNewForumTitle('');
      setNewForumContent('');
      setNewForumTag('Question');

      // Re-fetch forums
      const updatedForums = await axiosInstance.get(`/courses/slug/${courseSlug}/forums`, {
        withCredentials: true,
      });
      setForums(updatedForums.data);
    } catch (error) {
      toast.error('Failed to create forum.');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6">Course Forum</h1>

      {/* Create Forum Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-6"
      >
        Create Post
      </button>

      {/* Create Forum Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[500px]">
            <h2 className="text-2xl font-bold mb-4">Create New Forum Post</h2>
            <label className="block mb-4">
              Title:
              <input
                type="text"
                value={newForumTitle}
                onChange={(e) => setNewForumTitle(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              />
            </label>
            <label className="block mb-4">
              Tag:
              <select
                value={newForumTag}
                onChange={(e) => setNewForumTag(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              >
                <option value="Helpful">Helpful</option>
                <option value="Frequent Questions">Frequent Questions</option>
                <option value="Question">Question</option>
                <option value="Answer">Answer</option>
                <option value="Announcement">Announcement</option>
              </select>
            </label>
            <label className="block mb-4">
              Content:
              <textarea
                value={newForumContent}
                onChange={(e) => setNewForumContent(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
                rows={4}
              />
            </label>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateForum}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List of Forums */}
      <div className="space-y-6">
        {forums.length > 0 ? (
          forums.map((forum) => (
            <div
              key={forum._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <h2 className="text-xl font-semibold">{forum.title}</h2>
              <p className="text-gray-700 mt-2">{forum.content}</p>
              <span className="text-sm text-blue-600 underline cursor-pointer">
                Load replies ({forum.threads.length})
              </span>
              {/* Optionally, implement loading replies functionality */}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No forum posts available.</p>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
