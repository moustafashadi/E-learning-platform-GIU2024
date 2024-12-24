// /app/components/Course/StudentCourses.tsx
'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/app/_utils/axiosInstance';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import CourseCard from '@/app/components/Course/CourseCard';
import { BackendCourse, FrontendCourse } from '@/app/types';
import useAuth from '@/app/hooks/useAuth';

const StudentCourses = () => {
  const router = useRouter();

  // Use the custom authentication hook
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const userId = user?._id || null;

  const [enrolledCourses, setEnrolledCourses] = useState<FrontendCourse[]>([]);
  const [availableCourses, setAvailableCourses] = useState<FrontendCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null); // To handle enrollment loading state

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Fetch all available courses
        const allCoursesResp = await axiosInstance.get('/courses', {
          withCredentials: true,
        });
        const allCourses: BackendCourse[] = allCoursesResp.data;

        // Debugging: Log all courses fetched
        console.log('All Courses fetched:', allCourses);

        // Extract enrolled course IDs from user data
        const userEnrolledCourseIds: string[] = user?.enrolledCourses || [];

        // Debugging: Log enrolled course IDs
        console.log('User Enrolled Course IDs:', userEnrolledCourseIds);

        // Find enrolled courses by filtering all courses
        const userEnrolledCourses: BackendCourse[] = allCourses.filter(course =>
          userEnrolledCourseIds.includes(course._id)
        );

        // Debugging: Log enrolled courses
        console.log('User Enrolled Courses:', userEnrolledCourses);

        // Find available courses by excluding enrolled courses
        const available = allCourses.filter(course => !userEnrolledCourseIds.includes(course._id));

        // Debugging: Log available courses
        console.log('Available Courses:', available);

        // Map enrolled courses to FrontendCourse interface
        const mappedEnrolledCourses: FrontendCourse[] = userEnrolledCourses.map(course => ({
          id: course._id,
          name: course.title,
          progress: 0, // Initialize or fetch progress if available
        }));

        // Map available courses to FrontendCourse interface
        const mappedAvailableCourses: FrontendCourse[] = available.map(course => ({
          id: course._id,
          name: course.title,
          progress: 0, // Not enrolled yet
        }));

        // Debugging: Log mapped courses
        console.log('Mapped Enrolled Courses:', mappedEnrolledCourses);
        console.log('Mapped Available Courses:', mappedAvailableCourses);

        setEnrolledCourses(mappedEnrolledCourses);
        setAvailableCourses(mappedAvailableCourses);
      } catch (error) {
        toast.error('Failed to fetch courses.');
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch courses if user is authenticated and userId is available
    if (isAuthenticated && userId) {
      fetchCourses();
    } else if (!authLoading) {
      // If not authenticated and not loading, show error
      if (!isAuthenticated) {
        toast.error('User not authenticated.');
      }
      setLoading(false);
    }
  }, [isAuthenticated, userId, user?.enrolledCourses, authLoading]);

  const handleViewCourse = (courseId: string) => {
    if (!courseId) {
      toast.error('Course ID is undefined.');
      console.error('Course ID is undefined.');
      return;
    }
    console.log(`Navigating to course: ${courseId}`);
    router.push(`/course/${courseId}`);
  };

  const handleEnroll = async (courseId: string) => {
    if (!userId) {
      toast.error('User not authenticated.');
      return;
    }

    setEnrollingCourseId(courseId);
    try {
      // Enrollment API call: POST /users/:userId/enroll/:courseId
      await axiosInstance.post(`/users/${userId}/enroll/${courseId}`, {}, {
        withCredentials: true,
      });
      toast.success('Enrolled successfully.');

      // Find the enrolled course from availableCourses
      const enrolledCourse = availableCourses.find(course => course.id === courseId);

      if (enrolledCourse) {
        // Add to enrolledCourses with initial progress
        setEnrolledCourses([...enrolledCourses, { ...enrolledCourse, progress: 0 }]);

        // Remove from availableCourses
        setAvailableCourses(availableCourses.filter(course => course.id !== courseId));

        // Debugging: Log updated courses
        console.log('Enrolled Courses after enrollment:', [...enrolledCourses, { ...enrolledCourse, progress: 0 }]);
        console.log('Available Courses after enrollment:', availableCourses.filter(course => course.id !== courseId));
      }
    } catch (error) {
      toast.error('Failed to enroll in the course.');
      console.error('Enrollment Error:', error);
    } finally {
      setEnrollingCourseId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100">
      {/* Enrolled Courses Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6">Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={true}
                onViewCourse={() => handleViewCourse(course.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You are not enrolled in any courses yet.</p>
        )}
      </section>

      {/* Available Courses Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Available Courses</h2>
        {availableCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={false}
                onViewCourse={() => handleViewCourse(course.id)}
                onEnroll={() => handleEnroll(course.id)}
                isEnrolling={enrollingCourseId === course.id}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No available courses for enrollment.</p>
        )}
      </section>
    </div>
  );
};

export default StudentCourses;
