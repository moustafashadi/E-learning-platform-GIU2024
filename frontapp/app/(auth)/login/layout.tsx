// filepath: /app/login/layout.tsx
"use client";

import React from "react";
import Link from "next/link";

function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 p-4 text-white text-center">
        <Link href="/" className="text-lg font-bold hover:underline">
          Back to Home
        </Link>
      </header>
      <main className="flex-grow flex justify-center items-center bg-gray-100">
        {children}
      </main>
      <footer className="bg-gray-200 p-4 text-center">
        <p>&copy; {new Date().getFullYear()} E-Learning Platform</p>
      </footer>
    </div>
  );
}

export default LoginLayout;
