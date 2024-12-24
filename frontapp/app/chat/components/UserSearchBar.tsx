"use client";

import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../_utils/axiosInstance';

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    profilePicUrl?: string;
}

interface UserSearchBarProps {
    onUserSelect: (userId: string) => void;
}

const UserSearchBar = ({ onUserSelect }: UserSearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch users when component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (user: User) => {
        onUserSelect(user._id);
        setSearchTerm(user.username);
        setShowDropdown(false);
    };

    // Close dropdown when clicking outside
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
        <div className="relative w-full max-w-md" ref={dropdownRef}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search users..."
                className="w-full px-6 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
            
            {showDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-3 text-center text-gray-500">Loading...</div>
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => handleSelect(user)}
                                className="p-4 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                            >
                                <div className="font-medium">{user.username}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-center text-gray-500">No users found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserSearchBar;