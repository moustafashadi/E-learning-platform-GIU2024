"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import InstructorProfile from "./components/InstructorProfile";
import StudentProfile from "./components/StudentProfile";

const ProfilePage: React.FC = () => {
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
    case "instructor":
      return <InstructorProfile />;
    case "student":
      return <StudentProfile />;
    default:
      return <div>Invalid role</div>;
  }
};

export default <Profile></Profile>Page;
