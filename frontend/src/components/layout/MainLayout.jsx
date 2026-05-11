import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import "./MainLayout.css";
import { ENDPOINT } from "../../config/endpoint";

const MainLayout = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${ENDPOINT}/api/auth/main`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
        setUser(data);
      } catch (err) {
        console.error("Auth verify failed:", err);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    if (token) fetchUser();
  }, [token]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="layout-container">
      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <SideBar />
      </div>
      {sidebarOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <div className="layout-content">
        <div className="mobile-topbar">
          <button
            className="mobile-menu-btn"
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen((s) => !s)}
          >
            ☰
          </button>
          <div />
        </div>

        <div className="page-area">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;
