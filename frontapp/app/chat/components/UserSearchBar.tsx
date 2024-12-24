"use client";

import { useState } from 'react';

interface UserSearchBarProps {
    onUserSelect: (userId: string) => void;
}

const UserSearchBar = ({ onUserSelect }: UserSearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="w-full max-w-md mb-4">
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default UserSearchBar;