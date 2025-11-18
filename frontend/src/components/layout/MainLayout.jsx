import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import "./MainLayout.css"; 

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="layout-container">

      <SideBar />

      <div className="layout-content">
        <div className="top-bar">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="page-area">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default MainLayout;
