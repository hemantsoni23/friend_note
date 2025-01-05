import React, { useState, useContext } from 'react';
import FriendsList from '../components/FriendsList';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';

const Profile = () => {
  const { user, handleSetUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  console.log(user);

  const handleSave = async(updatedData) => {
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
            <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted mt-1">{user.bio || 'No bio provided'}</p>
            <div className="flex items-center mt-3 space-x-6">
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
                onClick={() => setIsEditing(true)}
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

      {/* Edit Profile Modal */}
      {isEditing && <EditProfileModal user={user} onSave={handleSave} onClose={() => setIsEditing(false)} />}
    </div>
  );
};

const EditProfileModal = ({ user, onSave, onClose }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [interests, setInterests] = useState(user.interests || []);
  const [avatarIndex, setAvatarIndex] = useState(user.avatarIndex);

  const avatars = Array.from({ length: 6 }, (_, i) => i); 
  const allInterests = [
    "Music",
    "Travel",
    "Photography",
    "Coding",
    "Gaming",
    "Cooking",
    "Reading",
    "Fitness",
    "Movies",
    "Art",
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
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
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-800"
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
                  avatarIndex === index ? "border-primary" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
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