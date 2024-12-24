// /components/Course/StudentCourses.tsx
import { useEffect, useState } from 'react';
import axiosInstance from '@/app/_utils/axiosInstance';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import CourseCard from '@/app/components/Course/CourseCard';
import { Course } from '@/app/types';

const StudentCourses = () => {
  const router = useRouter();

  // Fetch userId from Redux store
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
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
        const allCourses: Course[] = allCoursesResp.data;

        // Fetch enrolled courses from user info
        const userResp = await axiosInstance.get('/auth/me', {
          withCredentials: true,
        });
        const userEnrolledCourses: Course[] = userResp.data.user.enrolledCourses || [];

        // Determine available courses (not enrolled)
        const enrolledCourseIds = new Set(userEnrolledCourses.map((course) => course._id));
        const available = allCourses.filter((course) => !enrolledCourseIds.has(course._id));

        setEnrolledCourses(userEnrolledCourses);
        setAvailableCourses(available);
      } catch (error) {
        toast.error('Failed to fetch courses.');
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch courses if user is authenticated and userId is available
    if (userId) {
      fetchCourses();
    } else {
      toast.error('User not authenticated.');
      setLoading(false);
    }
  }, [userId]);

  const handleViewCourse = (courseSlug: string) => {
    router.push(`/course/${courseSlug}`);
  };

  const handleEnroll = async (courseId: string, courseSlug: string) => {
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

      // Update the enrolled and available courses lists
      const enrolledCourse = availableCourses.find((course) => course._id === courseId);
      if (enrolledCourse) {
        setEnrolledCourses([...enrolledCourses, { ...enrolledCourse}]);
        setAvailableCourses(availableCourses.filter((course) => course._id !== courseId));
      }
    } catch (error) {
      toast.error('Failed to enroll in the course.');
      console.error('Enrollment Error:', error);
    } finally {
      setEnrollingCourseId(null);
    }
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
      {/* Enrolled Courses Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6">Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={{
                  id: course._id,
                  slug: course.course_code, // Assuming `slug` corresponds to `course_code`
                  name: course.title,
                  progress: 0, // Initialize progress or fetch if available
                }}
                isEnrolled={true}
                onViewCourse={() => handleViewCourse(course.course_code)}
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
            {availableCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={{
                  id: course._id,
                  slug: course.course_code, // Assuming `slug` corresponds to `course_code`
                  name: course.title,
                  progress: 0, // Not enrolled yet
                }}
                isEnrolled={false}
                onViewCourse={() => handleViewCourse(course.course_code)}
                onEnroll={() => handleEnroll(course._id, course.course_code)}
                isEnrolling={enrollingCourseId === course._id}
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
