// /app/course/[courseSlug]/page.tsx
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import StudentCourses from "./components/StudentCourses"; // Import the StudentCourses component

import useAuth from "../hooks/useAuth"; // Assume this hook handles authentication
import InstructorCourses from "./components/InstructorCourses";
import Notes from "./view/notes";

function CoursePage() {
  const { courseSlug } = useParams();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const { isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true); // Separate loading state for role fetching

  useEffect(() => {
    // Fetch the user's role if authenticated
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get("/auth/me", { withCredentials: true });
        const user = response.data.user;
        setRole(user.role);
      } catch (error) {
        toast.error("You must be logged in to access the dashboard.");
        router.push("/login");
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchUserRole();
    } else if (!isAuthenticated && !authLoading) {
      // Redirect unauthenticated users to login
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (role) {
      setLoading(false);
    }
  }, [role]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  // Determine the dashboard content based on the user's role
  const renderCourseContent = () => {
    switch (role) {
      case "instructor":
        return <InstructorCourses />; // Render InstructorDashboard for instructors
      case "student":
        return <StudentCourses />; // Render StudentCourses for students
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
