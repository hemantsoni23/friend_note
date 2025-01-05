import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import FriendsList from '../components/FriendsList';

const Friends = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="p-6 ml-64 min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-300">
            <div className="max-w-4xl mx-auto bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-600 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4">Friends List</h1>
                <FriendsList friends={user.friends} />
            </div>
        </div>
    );
};

export default Friends;
