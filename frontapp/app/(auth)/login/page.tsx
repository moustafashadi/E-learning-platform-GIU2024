"use client";

import React, { useState } from "react";
import axios from "axios"; // Adjust the path if necessary
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // Optional: For toast notifications
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [feedback, setFeedback] = useState('');
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(loginStart());
    try {
      // Call the backend API for login using relative path
      const response = await axios.post("/auth/login", { email, password });

      const payload = response.data.user;
      console.log("payload: ", response.data.user.sub);

      // Dispatch login success action
      dispatch(loginSuccess(payload));

      // Persist authentication state in local storage
      localStorage.setItem('authState', JSON.stringify({
        isAuthenticated: true,
        user: payload,
      }));

      setFeedback(`Login successful! Welcome, ${payload.username}`);
      toast.success(`Login successful! Welcome, ${payload.username}`); // Optional: Show toast notification

      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      dispatch(loginFailure());
      setFeedback(error.message || "Login failed. Please try again.");
      toast.error(error.message || "Login failed. Please try again."); // Optional
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Login to Your Account</h2>
        <form onSubmit={handleLogin} className="space-y-4">
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
              className="mt-1 w-full px-4 py-2 border rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-1 w-full px-4 py-2 border rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
        {feedback && (
          <p
            className={`mt-4 text-center ${feedback.toLowerCase().includes("successful") ? "text-green-600" : "text-red-600"
              }`}
          >
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;