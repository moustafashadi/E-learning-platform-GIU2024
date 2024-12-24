"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../_utils/axiosInstance";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/auth/me", { withCredentials: true });
        setUser(response.data.user);
        setFormData({
          username: response.data.user.username,
          email: response.data.user.email,
          password: "",
        });
      } catch (error) {
        toast.error("You must be logged in to access the Profile.");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    } else if (!authLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (field: keyof typeof formData) => {
    try {
      await axiosInstance.patch(`/users/${user._id}`, { [field]: formData[field] });
      toast.success(`${field} updated successfully`);
      setEditingField(null);
      setUser({ ...user, [field]: formData[field] });
    } catch (error) {
      toast.error(`Failed to update ${field}`);
    }
  };
  

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete(`/users/${user._id}`);
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  const handleProfilePictureChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePic", file);
      try {
        const response = await axiosInstance.patch(`/users/${user._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Profile picture updated successfully");
        setUser({ ...user, profilePicUrl: response.data.profilePicUrl });
      } catch (error) {
        toast.error("Failed to update profile picture");
      }
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      {/* Profile Picture Section */}
      <div className="relative">
        <img
          src={user.profilePicUrl || "/default-profile.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full shadow-md border border-gray-300"
        />
        <label
          htmlFor="profilePic"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full cursor-pointer text-sm shadow-md hover:bg-blue-700 transition"
        >
          Edit
        </label>
        <input
          type="file"
          id="profilePic"
          className="hidden"
          onChange={handleProfilePictureChange}
        />
      </div>

      {/* User Details */}
      <div className="mt-6 w-full max-w-md space-y-4">
        {/* Username */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Username:</span>
          {editingField === "username" ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="border px-2 py-1 rounded-md"
              />
              <button
                onClick={() => handleUpdate("username")}
                className="bg-blue-600 text-white px-3 py-1 rounded-md shadow-md hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          ) : (
            <span>
              {user.username}{" "}
              <button
                onClick={() => setEditingField("username")}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
            </span>
          )}
        </div>

        {/* Email */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Email:</span>
          {editingField === "email" ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="border px-2 py-1 rounded-md"
              />
              <button
                onClick={() => handleUpdate("email")}
                className="bg-blue-600 text-white px-3 py-1 rounded-md shadow-md hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          ) : (
            <span>
              {user.email}{" "}
              <button
                onClick={() => setEditingField("email")}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Password:</span>
          {editingField === "password" ? (
            <div className="flex space-x-2">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="border px-2 py-1 rounded-md"
              />
              <button
                onClick={() => handleUpdate("password")}
                className="bg-blue-600 text-white px-3 py-1 rounded-md shadow-md hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          ) : (
            <span>
              ******{" "}
              <button
                onClick={() => setEditingField("password")}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Delete Account */}
      <div className="mt-6">
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
