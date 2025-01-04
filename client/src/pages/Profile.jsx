import React, { useContext } from 'react';
import FriendsList from '../components/FriendsList';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  
  if(!user) return <div>Loading ...</div>;
  return (
    <div className="p-6 ml-64 min-h-screen bg-background-light text-text-light">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <img
              src={`${process.env.PUBLIC_URL}/assets/avatars/a_${user.avatarIndex}.png`}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          {/* User Details Section */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted mt-1">{user.bio || 'No bio provided'}</p>
            <div className="flex items-center mt-3 space-x-6">
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
                onClick={() => console.log('Edit Profile')}
              >
                Edit Profile
              </button>
              <button
                className="px-4 py-2 border border-border-light rounded-md hover:bg-background-dark hover:text-white"
                onClick={() => console.log('Settings')}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
        {/* Friend List Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Friends ({user?.friends?.length || 0})</h2>
          <FriendsList friends={user.friends} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
