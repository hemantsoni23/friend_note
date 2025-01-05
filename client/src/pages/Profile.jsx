import React, { useState, useContext } from 'react';
import FriendsList from '../components/FriendsList';
import SettingsModal from '../components/SettingsModal';
import { AuthContext } from '../context/AuthContext';
import { useSettings } from '../hooks/useSettings';
import axios from 'axios';
import Cookies from 'js-cookie';

const Profile = () => {
  const { user, handleSetUser } = useContext(AuthContext);
  const { toggleTheme, logoutUser } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const handleSave = async (updatedData) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_ROUTE}/api/users/update`, updatedData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      });
    } catch (err) {
      console.error(err);
    }
    handleSetUser({ ...user, ...updatedData });
    setIsEditing(false);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6 ml-64 min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-6">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <img
              src={`${process.env.PUBLIC_URL}/assets/avatars/a_${user.avatarIndex}.png`}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-primary dark:border-secondary"
            />
          </div>
          {/* User Details Section */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted dark:text-gray-400 mt-1">
              {user.bio || 'No bio provided'}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {user?.interests.length > 0 ? (
                user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full bg-primary text-white dark:bg-secondary"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  No interests added
                </span>
              )}
            </div>
            <div className="flex items-center mt-4 space-x-4">
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button
                className="px-4 py-2 border border-border-light dark:border-border-dark rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setSettingsOpen(true)}
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

      {/* Edit Profile Modal */}
      {isEditing && <EditProfileModal user={user} onSave={handleSave} onClose={() => setIsEditing(false)} />}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        onThemeToggle={toggleTheme}
        onDeleteAccount={() => console.log('Delete Account')}
        onLogout={logoutUser}
        onChangeUsername={() => console.log('Change Username')}
      />
    </div>
  );
};

const EditProfileModal = ({ user, onSave, onClose }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [interests, setInterests] = useState(user.interests || []);
  const [avatarIndex, setAvatarIndex] = useState(user.avatarIndex);

  const avatars = Array.from({ length: 6 }, (_, i) => i);
  const allInterests = [
    'Music',
    'Travel',
    'Photography',
    'Coding',
    'Gaming',
    'Cooking',
    'Reading',
    'Fitness',
    'Movies',
    'Art',
  ];

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    onSave({ name, bio, interests, avatarIndex });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-primary dark:focus:border-secondary dark:bg-gray-800"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-primary dark:focus:border-secondary dark:bg-gray-800"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Interests</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {allInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1 text-sm rounded-md cursor-pointer ${
                  interests.includes(interest)
                    ? 'bg-primary text-white dark:bg-secondary'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Avatar</label>
          <div className="grid grid-cols-5 gap-2">
            {avatars.map((index) => (
              <img
                key={index}
                src={`${process.env.PUBLIC_URL}/assets/avatars/a_${index}.png`}
                alt={`Avatar ${index}`}
                onClick={() => setAvatarIndex(index)}
                className={`w-12 h-12 rounded-full cursor-pointer border ${
                  avatarIndex === index ? 'border-primary border-2 dark:border-secondary' : 'border-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;