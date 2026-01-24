import React from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import { Home, Crown, Moon, Library,PenLine ,User,LogOut} from 'lucide-react';
import './SideBar.css';

function SideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="sidebar">
      <h2 className="logo">BookNest</h2>
      <div className="nav-section">
        <ul className="nav-links">
          <li><NavLink to="/main" end><Home className="icon" /><span>Discover</span></NavLink></li>
          <li><NavLink to="/main/library"><Library/><span>My Library</span></NavLink></li>
          <li><NavLink to="/main/premium"><Crown className="icon" /><span>Premium</span></NavLink></li>
          <li><NavLink to="/main/my-books"><PenLine className="icon" /><span>Self Writing</span></NavLink>
          </li>
          <li><NavLink to="/main/profile"><User className="icon"/><span>Profile</span></NavLink></li>
        </ul>
      </div>


       <div className="sidebar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut />
          Log Out
        </button>
      </div>
    </div>
  );
}

export default SideBar;
