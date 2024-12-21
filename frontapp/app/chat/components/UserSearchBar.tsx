"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "../../_utils/axiosInstance"; // Import configured axios instance

const UserSearchBar: React.FC<{ onUserSelect: (userId: string) => void }> = ({ onUserSelect }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users", {
          withCredentials: true
        });
        console.log("Fetched users:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (userId: string) => {
    onUserSelect(userId);
    setSearchTerm("");
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded p-2 w-full"
        placeholder="Search for a user..."
      />
      <ul className="absolute z-10 bg-white border rounded w-full mt-1">
        {filteredUsers.map(user => (
          <li
            key={user._id}
            onClick={() => handleUserSelect(user._id)}
            className="p-2 hover:bg-gray-200 cursor-pointer"
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearchBar;