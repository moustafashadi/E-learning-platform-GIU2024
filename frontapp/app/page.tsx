// app/page.tsx
"use client";

import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the E-Learning Platform</h1>
      <p className="text-lg text-center">
        Enhance your skills with our comprehensive courses. Please login or signup to get started.
      </p>
    </div>
  );
};

export default HomePage;
