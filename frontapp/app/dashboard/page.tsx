"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import AdminDashboard from "./components/AdminDashboard";
import InstructorDashboard from "./components/InstructorDashboard";
import StudentDashboard from "./components/StudentDashboard";
import Sidebar from "./components/Sidebar";
import useAuth from "../hooks/useAuth";
import { selectAuthState } from "../store/slices/authSlice";

import { useSelector } from "react-redux";

function DashboardPage() {
  
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const { isAuthenticated, loading, user } = useSelector(selectAuthState);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/auth/me", { withCredentials: true });
        setRole(response.data.user.role);
      } catch (error) {
        toast.error("You must be logged in to access the dashboard.");
        router.push("/login");
      }
    };

    if (isAuthenticated) {
      fetchUserRole();
    } else if (!loading) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const renderDashboard = () => {
    if (!role) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <p className="text-lg font-semibold">Loading role...</p>
        </div>
      );
    }

    switch (role) {
      case "admin":
        return <AdminDashboard />;
      case "instructor":
        return <InstructorDashboard />;
      case "student":
        return <StudentDashboard />;
      default:
        return <div className="text-center mt-10">Invalid role</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      {role && <Sidebar role={role} />}
      <main className="flex-1 p-6 bg-gray-100">{renderDashboard()}</main>
    </div>
  );
}

export default DashboardPage;
