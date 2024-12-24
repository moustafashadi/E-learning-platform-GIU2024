// /app/forum/[courseId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/app/_utils/axiosInstance';
import toast from 'react-hot-toast';
import BackButton from '@/app/components/common/BackButton';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
// Import necessary components for the forum

const ForumPage = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [forumData, setForumData] = useState<any>(null); // Define proper type as needed
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError('Course ID is undefined.');
      setLoading(false);
      toast.error('Course ID is undefined.');
      return;
    }

    const fetchForumData = async () => {
      setLoading(true);
      try {
        // Fetch forum data related to the course
        const forumResp = await axiosInstance.get(`/forum/${courseId}`, {
          withCredentials: true,
        });
        setForumData(forumResp.data);
      } catch (err) {
        console.error('Failed to fetch forum data:', err);
        setError('Failed to load forum data.');
        toast.error('Failed to load forum data.');
      } finally {
        setLoading(false);
      }
    };

    fetchForumData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !forumData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error || 'Forum not found.'}</p>
        <BackButton />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6">Course Forum</h1>
      {/* Render forum data here */}
      {/* For example, list of threads, posts, etc. */}
    </div>
  );
};

export default ForumPage;
