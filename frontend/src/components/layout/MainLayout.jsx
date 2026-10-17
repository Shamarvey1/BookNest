import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./MainLayout.css";
import { ENDPOINT } from "../../config/endpoint";

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
        console.error("Auth verify failed:", err);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    if (token) fetchUser();

    const handleProfileUpdate = (e) => {
      if (e.detail) {
        setUser((prev) => ({ ...prev, ...e.detail }));
      }
    };

    window.addEventListener("userProfileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("userProfileUpdated", handleProfileUpdate);
  }, [token, navigate]);

  return (
    <div className="main-app-layout">

      <Navbar user={user} />

      <main className="main-viewport">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

