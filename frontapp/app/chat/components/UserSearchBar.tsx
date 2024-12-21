"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const UserSearchBar: React.FC<{ onUserSelect: (userId: string) => void; courseId: string }> = ({ onUserSelect, courseId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users/");
        console.log("Fetched users:", response.data); // Log the fetched users
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
        user.enrolledCourses.includes(courseId) // Filter by common course
      );
      setFilteredUsers(filtered);
      setUserNotFound(filtered.length === 0);
    } else {
      setFilteredUsers([]);
      setUserNotFound(false);
    }
  }, [searchTerm, users, courseId]);

  const handleUserSelect = (userId: string) => {
    onUserSelect(userId);
    setSearchTerm(""); // Clear the search term after selection
    setFilteredUsers([]); // Clear the dropdown
    setUserNotFound(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded p-2 w-full"
        placeholder="Search for a user..."
      />
      {userNotFound && <p className="text-red-500">User not found</p>}
      {filteredUsers.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded w-full mt-1">
          {filteredUsers.map(user => (
            <li
              key={user.id}
              onClick={() => handleUserSelect(user.id)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {user.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearchBar;