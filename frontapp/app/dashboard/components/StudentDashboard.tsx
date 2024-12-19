// pages/StudentDashboard.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { response } from "express";

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

interface StudentDashboardProps {
  router: any; // Accept router as a prop
}

function StudentDashboard({ router }: StudentDashboardProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/me", {
          withCredentials: true,
        });
        setUserId(response.data.user.sub);
        setCourses(response.data.user.courses);
        //courses to string
        
        const courseIds = response.data.user.courses.map(response.data.user.courses.toString());

        const quizResultsData = await Promise.all(
          //feed the courseIds to the getStudentQuizResults API
          courseIds.map((courseId : string) =>
            axios.get(`/quiz/${courseId}/${userId}`)
          )
        );
        setQuizResults(
          quizResultsData.map((response) => response.data)
        );
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);

      }
    };

    fetchUser();
  }, [router]);

  // Fetch data
  useEffect(() => {
    if (!userId) return;
  }, [userId]);


    // Render loader if data is loading
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

