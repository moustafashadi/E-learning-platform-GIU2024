"use client";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axiosInstance from "../../_utils/axiosInstance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AxiosResponse } from "axios";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

interface Course {
  id: string;
  name: string;
  progress: number; // Percentage
  students: any[]; // Array of students (populated from the backend)
}

interface Notification {
  id: string;
  message: string;
}

function InstructorDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Fetch user ID and related data (Instructor's courses)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/auth/me", {
          withCredentials: true,
        });

        const userId = response.data.id;
        setUserId(userId);
        console.log("User ID (Instructor):", userId);

        // Fetch courses taught by the instructor
        try {
          const response = await axiosInstance.get(`/courses/teacher/${userId}`, {
            withCredentials: true,
          });

          console.log(`Courses taught by instructor ${userId}:`, response.data);

          // Format courses and calculate the student count
          const formattedCourses = response.data.map((course: any) => ({
            id: course.id || course._id || "unknown-id", // Handle `_id` or fallback to a default
            name: course.name || course.title || "Unnamed Course", // Handle `title` or fallback
            progress: course.progress || 0, // Default progress to 0 if not provided
            students: Array.isArray(course.students) ? course.students : [], // Ensure students is always an array
          }));

          console.log("Formatted Courses for Instructor Dashboard:", formattedCourses);
          setCourses(formattedCourses);
        } catch (error) {
          toast.error("Failed to fetch instructor's courses.");
          console.error("Error Fetching Instructor's Courses:", error);
        }

      } catch (error) {
        toast.error("Failed to fetch user data.");
        console.error("Error Fetching User Data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Fetch notifications for the instructor
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get("/notifications", {
          withCredentials: true,
        });

        console.log("Raw Notifications Response:", response.data);

        // Validate and map notifications
        const formattedNotifications = response.data
          .filter((notification: any) => notification?.message) // Ensure `message` exists
          .map((notification: any) => ({
            id: notification._id?.toString() || "unknown-id", // Handle `_id` or fallback to a default
            message: notification.message || "No message available",
            isRead: notification.isRead || false, // Add isRead for UI purposes
          }));

        console.log("Formatted Notifications for Display:", formattedNotifications);

        setNotifications(formattedNotifications);
      } catch (error) {
        toast.error("Failed to fetch notifications.");
        console.error("Error Fetching Notifications:", error);
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
      <h1 className="text-2xl font-bold mb-6">Instructor Dashboard</h1>

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

                {/* Display student count */}
                <p className="text-sm text-gray-600">
                  Students Enrolled: {course.students.length}
                </p>
              </div>
            ))
          ) : (
            <p>No courses available.</p> // Fallback when courses array is empty
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;
