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
    <div className="p-6 min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex-shrink-0">
            <img
              src={`${process.env.PUBLIC_URL}/assets/avatars/a_${user.avatarIndex}.png`}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-500 dark:text-gray-400">{user.bio || 'No bio provided'}</p>
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
              {user?.interests.length > 0 ? (
                user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full bg-blue-500 text-white dark:bg-blue-400"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No interests added</span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center sm:justify-start space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => setSettingsOpen(true)}
          >
            Settings
          </button>
        </div>

        {/* Friends List */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Friends ({user?.friends?.length || 0})</h2>
          <FriendsList friends={user.friends} />
        </div>
      </div>

      {/* Modals */}
      {isEditing && <EditProfileModal user={user} onSave={handleSave} onClose={() => setIsEditing(false)} />}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        onThemeToggle={toggleTheme}
        onLogout={logoutUser}
        onDeleteAccount={() => alert('Delete Account this feature is not available yet')}
        onChangeUsername={() => alert('Change Username this feature is not available yet')}
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
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md sm:max-w-lg shadow-lg">
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
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
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