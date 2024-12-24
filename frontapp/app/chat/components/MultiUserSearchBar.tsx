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

  const handleUserSelect = (user: User) => {
    const newSelected = [...selectedUsers, user];
    setSelectedUsers(newSelected);
    onUserSelect(newSelected);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveUser = (userId: string) => {
    const newSelected = selectedUsers.filter(user => user._id !== userId);
    setSelectedUsers(newSelected);
    onUserSelect(newSelected);
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-white">
        {selectedUsers.map(user => (
          <div 
            key={user._id}
            className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full"
          >
            <span>{user.username}</span>
            <button 
              onClick={() => handleRemoveUser(user._id)}
              className="text-blue-500 hover:text-blue-700"
            >
              ×
            </button>
          </div>
        ))}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={selectedUsers.length === 0 ? "Search users..." : "Add more users..."}
          className="flex-1 min-w-[200px] outline-none border-0"
        />
      </div>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {isLoading ? (
            <div className="p-2 text-center">Loading users...</div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleUserSelect(user)}
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
      
      {selectedUsers.length > 0 && (
        <button
          onClick={() => {
            onUserSelect(selectedUsers);
            setSelectedUsers([]);
          }}
          className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start {selectedUsers.length > 1 ? 'Group ' : ''}Chat
        </button>
      )}
    </div>
  );
};

export default MultiUserSearchBar;