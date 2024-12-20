"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Correctly use next/navigation
import axios from "axios";
import toast from "react-hot-toast";
import AdminDashboard from "./components/AdminDashboard";
import InstructorDashboard from "./components/InstructorDashboard";
import StudentDashboard from "./components/StudentDashboard";
import Sidebar from "./components/Sidebar";
import useAuth from "../hooks/useAuth";

function DashboardPage() {
  const router = useRouter(); // Use the correct router API
  const [role, setRole] = useState<string | null>(null);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Fetch the user's role if authenticated
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/auth/me", { withCredentials: true });
        const user = response.data.user;
        setRole(user.role);
      } catch (error) {
        toast.error("You must be logged in to access the dashboard.");
        router.push("/login");
      }
    };

    if (isAuthenticated) {
      fetchUserRole();
    } else if (!loading) {
      // Redirect unauthenticated users to login
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  // Determine the dashboard content based on the user's role
  const renderDashboard = () => {
    switch (role) {
      case "admin":
        return <AdminDashboard />;
      case "instructor":
        return <InstructorDashboard />;
      case "student":
        return <StudentDashboard  />; // Pass router correctly
      default:
        return <div className="text-center mt-10">Invalid role</div>;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar for navigation */}
      <Sidebar role={role} />

      {/* Main content area */}
      <main className="flex-1 p-6 bg-gray-100">{renderDashboard()}</main>
    </div>
  );
}

export default DashboardPage;
