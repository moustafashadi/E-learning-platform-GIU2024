// /app/course/[courseSlug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '../_utils/axiosInstance';
import toast from 'react-hot-toast';
import StudentCourses from './components/StudentCourses';
import InstructorCourses from './components/InstructorCourses';
import LoadingSpinner from '../components/common/LoadingSpinner';

function CoursePage() {
  const { courseSlug } = useParams();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user's role if authenticated
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get('/auth/me', { withCredentials: true });
        const user = response.data.user;
        setRole(user.role);
      } catch (error) {
        toast.error('You must be logged in to access the dashboard.');
        router.push('/login');
      }
    };

    fetchUserRole();
  }, [router]);

  useEffect(() => {
    if (role) {
      setLoading(false);
    }
  }, [role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  // Determine the dashboard content based on the user's role
  const renderCourseContent = () => {
    switch (role) {
      case 'instructor':
        return <InstructorCourses />;
      case 'student':
        return <StudentCourses />;
      default:
        return <div className="text-center mt-10">Invalid role</div>;
    }
  };

  return (
    <div className="flex">
      <main className="flex-1 p-6 bg-gray-100">{renderCourseContent()}</main>
    </div>
  );
}

export default CoursePage;
