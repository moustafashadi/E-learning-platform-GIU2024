// filepath: /f:/E-learning-platform-GIU2024/frontapp/components/NavBar.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchNotifications, selectUnreadNotifications } from "../store/slices/notificationSlice";
import { selectAuthState, logout as logoutAction } from "../store/slices/authSlice";
import axios from "axios";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  // Select authentication and notifications state from Redux
  const { isAuthenticated, loading, user } = useSelector(selectAuthState);
  const unreadNotifications = useSelector(selectUnreadNotifications);

  // Fetch notifications dynamically if authenticated
  useEffect(() => {
    if (isAuthenticated) {
    
    }
  }, [dispatch, isAuthenticated]);

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      dispatch(logoutAction()); // Update Redux state
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Highlight the current route
  const getNavLinkClasses = (route: string) =>
    `mx-2 hover:underline ${
      pathname === route ? "font-bold text-blue-300" : "text-white"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 p-4 text-white flex justify-between items-center z-50">
      <div>
        <Link href="/" className="text-lg font-bold hover:underline">
          E-Learning Platform
        </Link>
      </div>
      <div className="flex items-center">
        {!loading && !isAuthenticated ? (
          <>
            <Link href="/login" className={getNavLinkClasses("/login")}>
              Login
            </Link>
            <Link href="/signup" className={getNavLinkClasses("/signup")}>
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className={getNavLinkClasses("/dashboard")}>
              Dashboard
            </Link>
            <Link href="/profile" className={getNavLinkClasses("/profile")}>
              Profile
            </Link>
            <div className="relative mx-2">
              <Link
                href="/notifications"
                className={getNavLinkClasses("/notifications")}
              >
                Notifications
                {unreadNotifications.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadNotifications.length}
                  </span>
                )}
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="mx-2 hover:underline text-red-400"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
