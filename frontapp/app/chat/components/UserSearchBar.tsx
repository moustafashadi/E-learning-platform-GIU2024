"use client";

import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../_utils/axiosInstance"; // Import configured axios instance

const UserSearchBar: React.FC<{ onUserSelect: (userId: string) => void }> = ({ onUserSelect }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

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
    setIsDropdownOpen(false);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputClick = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onClick={handleInputClick}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded p-2 w-full"
        placeholder="Search for a user..."
      />
      {isDropdownOpen && (
        <ul ref={dropdownRef} className="absolute z-10 bg-white border rounded w-full mt-1 max-h-48 overflow-y-auto">
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
      )}
    </div>
  );
};

export default UserSearchBar;