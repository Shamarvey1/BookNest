import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import "./MainLayout.css";
import { ENDPOINT } from "../../constants";

const MainLayout = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

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
        console.err("Auth verify failed:", err);
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

      <SideBar user={user} />


      <div className="layout-content">

        <div className="top-bar">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="page-area">
          <Outlet context={{ user }} />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;
