// app/dashboard/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // Optional: For toast notifications

const DashboardPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("You must be logged in to access the dashboard.");
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg">
        Welcome to your dashboard! Here you can access your courses and manage your profile.
      </p>
      {/* Add more dashboard content here */}
    </div>
  );
};

export default DashboardPage;
