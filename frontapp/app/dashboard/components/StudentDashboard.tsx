"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
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

interface StudentDashboardProps {
  router: AppRouterInstance; // Correct type for the router
}

function StudentDashboard({ router }: StudentDashboardProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user ID and related data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/me", {
          withCredentials: true,
        });
        const userId = response.data.id;
        setUserId(userId);
        console.log("userId", userId);

        // Fetch and process courses
        const courseIds: string[] = response.data.user.enrolledCourses.map((courseId: ObjectId) =>
          courseId.toString()
        );
        console.log("courseIds", courseIds);

        // Fetch quiz results
        const quizResultsData = await Promise.all(
          courseIds.map((courseId: string) =>
            axios.get(`http://localhost:3000/quiz/${courseId}/${userId}`, {
              withCredentials: true,
            })
          )
        );
        setQuizResults(quizResultsData.map((res) => res.data));

        // Fetch course details
        const coursesData = await Promise.all(
          courseIds.map((courseId: string) =>
            axios.get(`http://localhost:3000/courses/${courseId}`, {
              withCredentials: true,
            })
          )
        );
        setCourses(coursesData.map((res) => res.data));
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
        const response = await axios.get("/notifications", {
          withCredentials: true,
        });
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
          {notifications.map((notification) => (
            <li key={notification.id} className="text-sm py-1">
              {notification.message}
            </li>
          ))}
        </ul>
      </div>

      {/* Dashboard Content */}
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      {/* Courses Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
              <div className="h-2 bg-gray-200 rounded-full mb-2">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                Progress: {course.progress}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Results Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quiz Results</h2>
        <ul>
          {quizResults.map((result, index) => (
            <li key={index} className="mb-2">
              <strong>Course ID:</strong> {result.quizId} -{" "}
              <strong>Score:</strong> {result.score}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StudentDashboard;
