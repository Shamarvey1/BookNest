import React from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import { Home, Crown, Moon } from 'lucide-react';
import './SideBar.css';

function SideBar() {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <h2 className="logo">BookNest</h2>
      <div className="nav-section">
        <ul className="nav-links">
          <li><NavLink to="/" end><Home className="icon" /><span>Home</span></NavLink></li>
          <li><NavLink to="/premium"><Crown className="icon" /><span>Premium</span></NavLink></li>
        </ul>
      </div>
      <div className="dark-mode"><Moon className="icon" />
        <button><span>Dark Mode</span></button>
      </div>
    </div>
  );
}

export default SideBar;
