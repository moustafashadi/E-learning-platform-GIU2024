"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../_utils/axiosInstance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ObjectId } from "mongodb";

interface Course {
  id: string;
  name: string;
  progress: number; // Percentage
}

interface Notification {
  id: string;
  message: string;
}

interface QuizResult {
  quizId: string;
  score: number;
}

function StudentDashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user ID and related data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/auth/me", {
          withCredentials: true,
        });

        const userId = response.data.id;
        setUserId(userId);
        console.log("User ID:", userId);

        // Fetch and process course data
        const courseIds: string[] =
          response.data.user?.enrolledCourses?.map((courseId: ObjectId) =>
            courseId.toString()
          ) || [];

        if (courseIds.length === 0) {
          toast.error("No enrolled courses found.");
          setCourses([]);
          return;
        }

        console.log("Course IDs:", courseIds);

        // Fetch details for each course
        const coursesData = await Promise.all(
          courseIds.map((courseId: string) =>
            axiosInstance.get(`http://localhost:3000/courses/${courseId}`, {
              withCredentials: true,
            })
          )
        );

        const formattedCourses = coursesData.map((res) => res.data);
        console.log("Courses Data:", formattedCourses);

        setCourses(formattedCourses);

        // Fetch quiz results for each course
        const quizResultsData = await Promise.all(
          courseIds.map((courseId: string) =>
            axiosInstance.get(`/quiz/${courseId}/${userId}`, {
              withCredentials: true,
            })
          )
        );

        const formattedQuizResults = quizResultsData.map((res) => res.data);
        console.log("Quiz Results:", formattedQuizResults);

        setQuizResults(formattedQuizResults);
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Fetch notifications
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get("/notifications", {
          withCredentials: true,
        });

        console.log("Notifications Data:", response.data.notifications);

        setNotifications(response.data.notifications);
      } catch (error) {
        toast.error("Failed to fetch notifications.");
        console.error(error);
      }
    };

    fetchNotifications();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-black mt-20 ml-2">
        <h1>Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="mt-[2rem] p-6">
      {/* Notifications Popup */}
      <div className="mt-[4rem] fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 w-64">
        <h3 className="font-bold text-lg">Notifications</h3>
        <ul>
          {notifications?.map((notification, index) => (
            <li key={notification.id || index} className="text-sm py-1">
              {notification.message}
            </li>
          )) || <p>No notifications available.</p>}
        </ul>
      </div>

      {/* Dashboard Content */}
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

     <div className="mb-8">
  <h2 className="text-xl font-semibold mb-4">My Courses</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {courses.length > 0 ? (
      courses.map((course, index) => (
        <div
          key={course.id || `course-${index}`} // Use course.id, fallback to index if id is missing
          className="bg-white shadow-md rounded-lg p-4 flex flex-col"
        >
          {/* Render course name */}
          <h3 className="text-lg font-semibold mb-2">{course.name || "Unnamed Course"}</h3>

          {/* Render progress bar */}
          <div className="h-2 bg-gray-200 rounded-full mb-2">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${course.progress || 0}%` }}
            ></div>
          </div>

          {/* Render progress percentage */}
          <span className="text-sm text-gray-600">
            Progress: {course.progress || 0}%
          </span>
        </div>
      ))
    ) : (
      <p>No courses available.</p> // Fallback when courses array is empty
    )}
  </div>
</div>

{/* Quiz Results Section */}
<div>
  <h2 className="text-xl font-semibold mb-4">Quiz Results</h2>
  <ul>
    {quizResults.length > 0 ? (
      quizResults.map((result, index) => (
        <li key={`quiz-result-${index}`} className="mb-2">
          <strong>Course ID:</strong> {result.quizId || "N/A"} -{" "}
          <strong>Score:</strong> {result.score || 0}%
        </li>
      ))
    ) : (
      <p>No quiz results available.</p> // Fallback when quizResults array is empty
    )}
  </ul>
</div>
</div>
  );
}

export default StudentDashboard;
