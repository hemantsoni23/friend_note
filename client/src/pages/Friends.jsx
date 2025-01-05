import React, { useContext, useState } from 'react';
import FriendsList from '../components/FriendsList';
import FriendRequests from '../components/FriendRequests';
import { AuthContext } from '../context/AuthContext';

const Friends = () => {
    const { user, refreshUser } = useContext(AuthContext);
    const [view, setView] = useState('friends');
    console.log(user);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="p-6 ml-64 min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-300">
            <div className="max-w-4xl mx-auto bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-600 rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4">Friends</h1>
                <div className="flex gap-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded-md ${
                            view === 'friends' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        onClick={() => setView('friends')}
                    >
                        Friends
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${
                            view === 'friendRequests' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        onClick={() => setView('friendRequests')}
                    >
                        Friend Requests
                    </button>
                </div>

                {view === 'friends' ? (
                    <FriendsList friends={user.friends} />
                ) : (
                    <FriendRequests
                        sentRequests={user.sentFriendRequests}
                        receivedRequests={user.receivedFriendRequests}
                        refreshUser={refreshUser}
                    />
                )}
            </div>
        </div>
    );
};

export default Friends;
