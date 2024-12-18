"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AdminCourses from "./components/AdminCourses";
import InstructorCourses from "./components/InstructorCourses";
import StudentCourses from "./components/StudentCourses";

const CoursesPage: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn || !storedRole) {
      toast.error("You must be logged in to access the dashboard.");
      router.push("/login");
    } else {
      setRole(storedRole); // Fetch the user role from localStorage
    }
  }, [router]);

  if (!role) {
    return <div>Loading...</div>; // Show loader while determining the role
  }

  // Render the appropriate dashboard based on the role
  switch (role) {
    case "admin":
      return <AdminCourses />;
    case "instructor":
      return <InstructorCourses />;
    case "student":
      return <StudentCourses />;
    default:
      return <div>Invalid role</div>;
  }
};

export default CoursesPage;
