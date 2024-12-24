// /components/Course/StudentCourses.tsx
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ModuleCard from './ModuleCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import BackButton from '../Common/BackButton';

interface Module {
  id: string;
  slug: string;
  title: string;
  pmScore: number;
  difficulty: string;
}

interface ModuleCategory {
  difficulty: string;
  averagePM: number;
  modules: Module[];
}

interface Course {
  id: string;
  slug: string;
  name: string;
  progress: number;
}

const StudentCourses = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [moduleCategories, setModuleCategories] = useState<ModuleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string>('');

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      try {
        // Fetch user info
        const userResp = await axiosInstance.get('/auth/me', {
          withCredentials: true,
        });
        const enrolledCourses: Course[] = userResp.data.user.enrolledCourses || [];

        setCourses(enrolledCourses);
      } catch (error) {
        toast.error('Failed to fetch enrolled courses.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleViewCourse = async (courseSlug: string, courseName: string) => {
    setSelectedCourseSlug(courseSlug);
    setSelectedCourseName(courseName);
    router.push(`/course/${courseSlug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">My Courses</h2>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200 flex flex-col"
            >
              <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
              <div className="h-2 bg-gray-200 rounded-full mb-2">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-700 mb-4">Progress: {course.progress}%</span>
              <div className="mt-auto flex space-x-4">
                <button
                  onClick={() => handleViewCourse(course.slug, course.name)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You are not enrolled in any courses yet.</p>
      )}
    </div>
  );
};

export default StudentCourses;
