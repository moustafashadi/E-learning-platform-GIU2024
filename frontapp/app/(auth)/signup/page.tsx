// app/signup/page.tsx
"use client";

import React, { useState } from "react";
import axios from "axios"; // Adjust the path if necessary
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // Optional: For toast notifications

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role
  const [feedback, setFeedback] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the backend API for signup using relative path
      const response = await axios.post("/auth/register", {
        username,
        email,
        password,
        role, // Include role in the request
      });

      const { message, user } = response.data;

      setFeedback(message);
      toast.success(message); // Optional: Show toast notification

      // Set isLoggedIn in localStorage
      localStorage.setItem("isLoggedIn", "true");

      // Redirect to dashboard after successful signup
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      if (error.response) {
        setFeedback(error.response.data.message || "Signup failed. Please try again.");
        toast.error(error.response.data.message || "Signup failed. Please try again."); // Optional
      } else {
        setFeedback("An error occurred. Please check your connection.");
        toast.error("An error occurred. Please check your connection."); // Optional
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Create an Account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            Signup
          </button>
        </form>
        {feedback && (
          <p
            className={`mt-4 text-center ${
              feedback.toLowerCase().includes("successful") ? "text-green-600" : "text-red-600"
            }`}
          >
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
