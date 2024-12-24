"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../../_utils/axiosInstance";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface MultiUserSearchBarProps {
  onUserSelect: (users: User[]) => void;
}

const MultiUserSearchBar = ({ onUserSelect }: MultiUserSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/users");
        console.log('API Response:', response.data); // Debug log
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else if (response.data.users) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = searchTerm.trim() === "" ? [] : users.filter(
    (user) =>
      !selectedUsers.find((u) => u._id === user._id) &&
      (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search users..."
        className="w-full px-4 py-2 border rounded-lg"
      />

      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {isLoading ? (
            <div className="p-2 text-center">Loading users...</div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  const newSelected = [...selectedUsers, user];
                  setSelectedUsers(newSelected);
                  onUserSelect(newSelected);
                  setSearchTerm("");
                  setShowDropdown(false);
                }}
              >
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            ))
          ) : (
            <div className="p-2 text-center">
              {searchTerm.trim() === "" ? "Type to search users" : "No users found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiUserSearchBar;