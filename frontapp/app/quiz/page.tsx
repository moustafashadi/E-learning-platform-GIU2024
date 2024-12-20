"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AdminQuiz from "./components/AdminQuiz";
import InstructorQuiz from "./components/InstructorQuiz";
import StudentQuiz from "./components/StudentQuiz";
import useAuth from "../hooks/useAuth";

function QuizPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const { isAuthenticated, loading } = useAuth();


  useEffect(() => {
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
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Render the appropriate quiz component based on the role
  switch (role) {
    case "admin":
      return <AdminQuiz />;
    case "instructor":
      return <InstructorQuiz />;
    case "student":
      return <StudentQuiz />;
    default:
      return <div>Invalid role</div>;
  }
}

export default QuizPage;