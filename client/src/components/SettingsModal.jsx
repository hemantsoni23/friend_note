import React from 'react';

const SettingsModal = ({ isOpen, onClose, onThemeToggle, onDeleteAccount, onLogout, onChangeUsername }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background-dark dark:bg-background-light rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-text-light text-text-dark">Settings</h2>
        <div className="space-y-4">
          <button
            className="w-full px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark"
            onClick={onThemeToggle}
          >
            Toggle Theme
          </button>
          <button
            className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            onClick={onChangeUsername}
          >
            Change Username
          </button>
          <button
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={onDeleteAccount}
          >
            Delete Account
          </button>
          <button
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
        <button
          className="mt-6 px-4 py-2 w-full text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
