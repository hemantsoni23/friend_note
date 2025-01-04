import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import FriendsList from './FriendsList';

const Friends = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="p-6 ml-64 min-h-screen bg-background-light text-text-light">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4">Friends List</h1>
                <FriendsList friends={user.friends} />
            </div>
        </div>
    );
};

export default Friends;
