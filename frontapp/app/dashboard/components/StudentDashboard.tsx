"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchUser } from "../../store/slices/userSlice";
import { fetchCourses } from "../../store/slices/courseSlice";
import { fetchNotifications } from "../../store/slices/notificationSlice";
import { fetchQuizResults } from "../../store/slices/quizResultSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

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
  courseId: string;
  score: number;
}

function StudentDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  if (!dispatch) {
    throw new Error('Redux Provider is missing.');
  }

  const router = useRouter();

  const { userId, loading: userLoading, error: userError } = useSelector((state: RootState) => state.user);
  const { courses, loading: coursesLoading, error: coursesError } = useSelector((state: RootState) => state.courses);
  const { notifications, loading: notificationsLoading, error: notificationsError } = useSelector((state: RootState) => state.notifications);
  const { quizResults, loading: quizResultsLoading, error: quizResultsError } = useSelector((state: RootState) => state.quizzes);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCourses(userId));
      dispatch(fetchNotifications(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId && courses.length > 0) {
      courses.forEach((course) => {
        dispatch(fetchQuizResults({ courseId: course.id, userId }));
      });
    }
  }, [dispatch, userId, courses]);

  if (userLoading || coursesLoading || notificationsLoading || quizResultsLoading) {
    return (
      <div className="text-black mt-20 ml-2">
        <h1>Loading Dashboard...</h1>
      </div>
    );
  }

  if (userError || coursesError || notificationsError || quizResultsError) {
    toast.error("Failed to fetch dashboard data.");
    console.error(userError || coursesError || notificationsError || quizResultsError);
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
              <strong>Course ID:</strong> {result.courseId} -{" "}
              <strong>Score:</strong> {result.score}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StudentDashboard;