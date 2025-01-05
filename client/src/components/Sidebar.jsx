import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaUsers, FaHeart, FaBars, FaSearch } from 'react-icons/fa';
import SettingsModal from './SettingsModal';
import { useSettings } from '../hooks/useSettings';

const Sidebar = () => {
  const location = useLocation();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const { toggleTheme, logoutUser } = useSettings();

  const navItems = [
    { to: '/profile', label: 'Profile', icon: <FaUser /> },
    { to: '/search', label: 'Search', icon: <FaSearch /> },
    { to: '/friends', label: 'Friends', icon: <FaUsers /> },
    { to: '/recommendations', label: 'Recommendations', icon: <FaHeart /> },
    { to: '#', label: 'Settings', icon: <FaBars />, action: () => setSettingsOpen(true) },
  ];

  return (
    <aside className="h-full w-64 dark:bg-background-light bg-background-dark text-text-dark dark:text-text-light fixed top-0 left-0 shadow-md">
      <div className="p-4 flex items-center justify-center bg-primary text-white">
        <h1 className="text-lg font-bold">FriendNote</h1>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          {navItems.map(({ to, label, icon, action }) => (
            <li key={label} className="text-sm font-medium">
              {action ? (
                <button
                  className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-md transition hover:bg-secondary hover:text-white"
                  onClick={action}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ) : (
                <Link
                  to={to}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
                    location.pathname === to
                      ? 'bg-secondary text-white'
                      : 'hover:bg-secondary hover:text-white'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        onThemeToggle={toggleTheme}
        onDeleteAccount={() => console.log('Delete Account')}
        onLogout={logoutUser}
        onChangeUsername={() => console.log('Change Username')}
      />
    </aside>
  );
};

export default Sidebar;
