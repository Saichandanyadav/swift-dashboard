import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="nav-logo-container">
          <img src="/Swift.svg" alt="Swift Logo" className="nav-logo" />
        </div>
        My Dashboard
      </div>
      <div className="nav-links">
        <NavLink to="/comments" className="nav-item">Comments</NavLink>
        <NavLink to="/users" className="nav-item">Users</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
