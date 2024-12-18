// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Initialize isLoggedIn from localStorage
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(storedIsLoggedIn === "true");

    // Listen for storage changes (e.g., login/logout from other tabs)
    const handleStorageChange = () => {
      const updatedIsLoggedIn = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(updatedIsLoggedIn === "true");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    // Optionally, remove tokens or other auth data
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <div>
        <Link href="/" className="text-lg font-bold hover:underline">
          E-Learning Platform
        </Link>
      </div>
      <div>
        {!isLoggedIn ? (
          <>
            <Link href="/login" className="mx-2 hover:underline">
              Login
            </Link>
            <Link href="/signup" className="mx-2 hover:underline">
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="mx-2 hover:underline">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="mx-2 hover:underline">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
