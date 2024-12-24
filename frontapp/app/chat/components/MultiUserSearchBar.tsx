import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../_utils/axiosInstance';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  profilePicUrl?: string;
}

interface MultiUserSearchBarProps {
  onUserSelect: (userIds: string[]) => void;
}

const MultiUserSearchBar = ({ onUserSelect }: MultiUserSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    !selectedUsers.find(selected => selected._id === user._id) &&
    (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchTerm('');
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(user => user._id !== userId));
  };

  const handleCreateChat = () => {
    if (selectedUsers.length > 0) {
      onUserSelect(selectedUsers.map(user => user._id));
      setSelectedUsers([]);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-md" ref={dropdownRef}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedUsers.map((user) => (
          <div key={user._id} className="flex items-center bg-blue-100 rounded-full px-3 py-1">
            <span className="text-sm">{user.username}</span>
            <button
              onClick={() => handleRemoveUser(user._id)}
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search users..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showDropdown && filteredUsers.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleSelect(user)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedUsers.length > 0 && (
        <button
          onClick={handleCreateChat}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Start Chat {selectedUsers.length > 1 ? 'Group' : ''}
        </button>
      )}
    </div>
  );
};

export default MultiUserSearchBar;