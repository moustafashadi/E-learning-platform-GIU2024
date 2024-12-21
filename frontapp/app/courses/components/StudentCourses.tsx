import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/store";
import ViewCourseStudent from "../view/ViewCourseStudent";

interface Course {
  _id: string;
  course_code: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  resources: string[];
  instructor: string;
  quizzes: string[];
}

function StudentCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null); // To store the userId
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null); // Track the course being viewed

  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch the logged-in user's data
        const { data: authData } = await axios.get("/auth/me", { withCredentials: true });
        setUserId(authData.id); // Set the user ID using the 'sub' field

        // Fetch enrolled courses using the provided endpoint
        const enrolledResponse = await axios.get(`http://localhost:3000/users/${authData.id}/enrolledCourses`, {
          withCredentials: true,
        });
        setEnrolledCourses(enrolledResponse.data);

        // Fetch all available courses
        const allCoursesResponse = await axios.get("http://localhost:3000/courses", {
          withCredentials: true,
        });

        // Filter courses to show only those the user isn't enrolled in
        const enrolledCourseIds = new Set(
          enrolledResponse.data.map((course: Course) => course._id) // Use _id for comparison
        );
        const availableCourses = allCoursesResponse.data.filter(
          (course: Course) => !enrolledCourseIds.has(course._id) // Filter available courses
        );
        setAvailableCourses(availableCourses);
      } catch (error) {
        toast.error("Failed to fetch courses. Please try again.");
        console.error(error); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const enrollInCourse = async (courseId: string) => {
    if (!userId) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    try {
      // Send enrollment request with courseId as the URL parameter and userId as part of the URL
      await axios.post(`http://localhost:3000/users/${userId}/enroll/${courseId}`, {}, { withCredentials: true });

      toast.success("Successfully enrolled in the course!");

      // Refresh course lists
      const enrolledCourse = availableCourses.find((course) => course._id === courseId);
      if (enrolledCourse) {
        setEnrolledCourses((prev) => [...prev, enrolledCourse]);
        setAvailableCourses((prev) => prev.filter((course) => course._id !== courseId));
      }
    } catch (error) {
      toast.error("Failed to enroll in the course.");
    }
  };

  const toggleCourseDetails = (courseId: string) => {
    setViewingCourseId(courseId); // Set the course ID for viewing
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="mt-[2rem] p-6 space-y-6 bg-gray-100">
      {/* Enrolled Courses Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <ul className="space-y-4">
            {enrolledCourses.map((course) => (
              <li key={course._id} className="p-4 bg-white rounded shadow-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{course.title}</h3>
                    <p className="text-gray-700">{course.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleCourseDetails(course._id)} // Set the course ID to viewingCourseId
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You are not enrolled in any courses yet.</p>
        )}
      </section>

      {/* Available Courses Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
        {availableCourses.length > 0 ? (
          <ul className="space-y-4">
            {availableCourses.map((course) => (
              <li
                key={course._id}
                className="p-4 bg-white rounded shadow-md border border-gray-200 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  <p className="text-gray-700">{course.description}</p>
                </div>
                <button
                  onClick={() => router.push(`/courses/view?courseid=${course._id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Enroll
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No courses available for enrollment.</p>
        )}
      </section>

      {/* Render the ViewCourseStudent Component if viewingCourseId is set */}
      {viewingCourseId && <ViewCourseStudent courseid={viewingCourseId} />}
    </div>
  );
}

export default StudentCourses;
