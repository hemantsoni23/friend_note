import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaUsers, FaHeart, FaSignInAlt } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { to: '/profile', label: 'Profile', icon: <FaUser /> },
    { to: '/friends', label: 'Friends', icon: <FaUsers /> },
    { to: '/recommendations', label: 'Recommendations', icon: <FaHeart /> },
    { to: '#', label: 'Logout', icon: <FaSignInAlt /> },
  ];

  return (
    <aside className="h-full w-64 bg-background-dark text-text-dark fixed top-0 left-0 shadow-md">
      <div className="p-4 flex items-center justify-center bg-primary text-white">
        <h1 className="text-lg font-bold">FriendNote</h1>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          {navItems.map(({ to, label, icon }) => (
            <li key={to} className={`text-sm font-medium`}>
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
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
