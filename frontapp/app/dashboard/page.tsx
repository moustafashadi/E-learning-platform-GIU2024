// app/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AdminDashboard from "./components/AdminDashboard";
import InstructorDashboard from "./components/InstructorDashboard";
import StudentDashboard from "./components/StudentDashboard";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  // Helper function to parse cookies
  const getCookie = (name: string): string | null => {
    const matches = document.cookie.match(
      new RegExp(
        // eslint-disable-next-line no-useless-escape
        "(?:^|; )" +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return matches ? decodeURIComponent(matches[1]) : null;
  };

  useEffect(() => {
    const storedRole = getCookie("role");
    const isLoggedIn = getCookie("isLoggedIn") === "true";

    if (!isLoggedIn || !storedRole) {
      toast.error("You must be logged in to access the dashboard.");
      router.push("/login");
    } else {
      setRole(storedRole); // Fetch the user role from cookies
    }
  }, [router]);

  if (!role) {
    return <div>Loading...</div>; // Show loader while determining the role
  }

  // Render the appropriate dashboard based on the role
  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "instructor":
      return <InstructorDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return <div>Invalid role</div>;
  }
};

export default DashboardPage;
