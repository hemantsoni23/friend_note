import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">FriendNote</div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/profile">
              <i className="fas fa-user"></i> Profile
            </Link>
          </li>
          <li>
            <Link to="/friends">
              <i className="fas fa-users"></i> Friends
            </Link>
          </li>
          <li>
            <Link to="/recommendations">
              <i className="fas fa-heart"></i> Recommendations
            </Link>
          </li>
          <li>
            <Link to="#" >
              <i className="fas fa-sign-out-alt"></i> Logout
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
