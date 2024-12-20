"use client";

import React from "react";
import Link from "next/link";
import useAuth from "./hooks/useAuth";
import Footer from "./components/Footer";

function HomePage() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Welcome to the E-Learning Platform</h1>
        <p className="text-lg text-center">
          Enhance your skills with our comprehensive courses. Please login or signup to get started.
        </p>
        {!loading && !isAuthenticated && (
          <Link href="/signup">
            <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Get Started
            </button>
          </Link>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default HomePage;