// app/login/layout.tsx
"use client";

import React from "react";
import Link from "next/link";

type LoginLayoutProps = {
  children: React.ReactNode;
};

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 p-4 text-white text-center">


      </header>
      <main className="flex-grow flex justify-center items-center bg-gray-100">
        {children}
      </main>
      <footer className="bg-gray-200 p-4 text-center">
        <p>&copy; 2024 E-Learning Platform</p>
      </footer>
    </div>
  );
};

export default LoginLayout;
