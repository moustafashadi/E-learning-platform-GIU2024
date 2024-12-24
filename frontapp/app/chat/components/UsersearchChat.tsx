"use client";

import { useState, useEffect } from 'react';
import axiosInstance from '../../_utils/axiosInstance';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface UserSearchChatProps {
  onUserSelect: (users: User[]) => void;
}

const UserSearchChat = ({ onUserSelect }: UserSearchChatProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (user: User) => {
    const isSelected = selectedUsers.find(u => u._id === user._id);
    let newSelectedUsers;
    
    if (isSelected) {
      newSelectedUsers = selectedUsers.filter(u => u._id !== user._id);
    } else {
      newSelectedUsers = [...selectedUsers, user];
    }
    
    setSelectedUsers(newSelectedUsers);
    onUserSelect(newSelectedUsers);
    setSearchTerm('');
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedUsers.find(u => u._id === user._id)
  );

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg">
        {selectedUsers.map(user => (
          <div 
            key={user._id}
            className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full"
          >
            <span>{user.username}</span>
            <button 
              onClick={() => handleUserSelect(user)}
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
          placeholder="Search users..."
          className="flex-1 min-w-[200px] outline-none border-0"
        />
      </div>
      
      {showDropdown && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredUsers.map(user => (
            <div
              key={user._id}
              onClick={() => handleUserSelect(user)}
              className="p-3 hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium">{user.username}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchChat;