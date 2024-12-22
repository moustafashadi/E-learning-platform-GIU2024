"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";
import axios from "axios";
import NotificationBell from "./NotificationsBell";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      dispatch(logout());
      localStorage.removeItem('authState'); // Clear local storage on logout
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 p-4 text-white flex justify-between items-center z-50">
      <div>
        <Link href="/" className="text-lg font-bold hover:underline">
          E-Learning Platform
        </Link>
      </div>
      <div>
        {!loading && !isAuthenticated ? (
          <Link href="/login" className="mx-2 hover:underline">
            Login
          </Link>
        ) : (
          <>
            <NotificationBell />
            <div>
              <Link href="/dashboard" className="mx-2 hover:underline">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="mx-2 hover:underline">
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;