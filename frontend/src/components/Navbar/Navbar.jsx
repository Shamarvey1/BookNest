import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Search,
  X,
  Library,
  PenLine,
  User,
  LogOut,
  Menu,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import openBook from "../../assets/icons/open-book.png";
import "./Navbar.css";

function Navbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchOpen, setSearchOpen] = useState(Boolean(query));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (query) setSearchOpen(true);
  }, [query]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const text = e.target.value;
    if (text) {
      setSearchParams({ q: text });
      if (location.pathname !== "/main") {
        navigate(`/main?q=${encodeURIComponent(text)}`);
      }
    } else {
      searchParams.delete("q");
      setSearchParams(searchParams);
    }
  };

  const handleClearSearch = () => {
    searchParams.delete("q");
    setSearchParams(searchParams);
    setSearchOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new CustomEvent("tokenChanged", { detail: { token: null } }));
    navigate("/");
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="netflix-header">
      <div className="header-left">

        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>

        <NavLink to="/main" className="header-brand" onClick={closeMobile}>
          <img src={openBook} alt="BookNest" className="header-logo-img" />
          <span className="header-brand-name">BookNest</span>
        </NavLink>

        <nav className="header-nav">
          <NavLink
            to="/main"
            end
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Discover
          </NavLink>
          <NavLink
            to="/main/library"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            My Library
          </NavLink>
          <NavLink
            to="/main/my-books"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Self Writing
          </NavLink>
        </nav>
      </div>

      <div className="header-right">

        <div className={`netflix-search-box ${searchOpen ? "open" : ""}`}>
          <button
            type="button"
            className="search-toggle-btn"
            onClick={() => {
              setSearchOpen((prev) => !prev);
              if (location.pathname !== "/main" && !searchOpen) {
                navigate("/main");
              }
            }}
            aria-label="Search books"
          >
            <Search size={19} />
          </button>

          <input
            ref={searchInputRef}
            type="text"
            className="netflix-search-input"
            placeholder="Titles, authors, genres..."
            value={query}
            onChange={handleSearchChange}
          />

          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="profile-dropdown-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className="header-profile-btn"
            onClick={() => setProfileDropdownOpen((prev) => !prev)}
            aria-expanded={profileDropdownOpen}
          >
            <div className="profile-avatar">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user?.name || "Avatar"} className="navbar-avatar-img" />
              ) : user?.name ? (
                user.name[0].toUpperCase()
              ) : (
                <User size={16} />
              )}
            </div>
            <span className="profile-name">
              {user?.name ? user.name.split(" ")[0] : "Account"}
            </span>
            <ChevronDown size={14} className={`dropdown-chevron ${profileDropdownOpen ? "open" : ""}`} />
          </button>

          {profileDropdownOpen && (
            <div className="profile-menu-dropdown">
              <div className="dropdown-user-header">
                <div className="dropdown-avatar-large">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user?.name || "Avatar"} className="dropdown-avatar-img" />
                  ) : user?.name ? (
                    user.name[0].toUpperCase()
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <div className="dropdown-user-details">
                  <span className="dropdown-user-name">{user?.name || "Reader"}</span>
                  <span className="dropdown-user-email">{user?.email}</span>
                </div>
              </div>

              <div className="dropdown-divider" />

              <NavLink
                to="/main/profile"
                className="dropdown-item"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <User size={16} />
                <span>Your Profile</span>
              </NavLink>

              <NavLink
                to="/main/premium"
                className="dropdown-item"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <CreditCard size={16} />
                <span className="dropdown-item-label">Membership & Billing</span>
                {user?.isPremium ? (
                  <span className="active-tier-pill">Active</span>
                ) : (
                  <span className="free-tier-pill">Free</span>
                )}
              </NavLink>

              <div className="dropdown-divider" />

              <button
                type="button"
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Sign Out of BookNest</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMobile}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="drawer-title">Menu</span>
              <button type="button" onClick={closeMobile} className="drawer-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="mobile-drawer-links">
              <NavLink to="/main" end onClick={closeMobile} className="mobile-nav-item">
                Discover
              </NavLink>
              <NavLink to="/main/library" onClick={closeMobile} className="mobile-nav-item">
                <Library size={18} />
                <span>My Library</span>
              </NavLink>
              <NavLink to="/main/my-books" onClick={closeMobile} className="mobile-nav-item">
                <PenLine size={18} />
                <span>Self Writing</span>
              </NavLink>
              <NavLink to="/main/profile" onClick={closeMobile} className="mobile-nav-item">
                <User size={18} />
                <span>Your Profile</span>
              </NavLink>
              <NavLink to="/main/premium" onClick={closeMobile} className="mobile-nav-item">
                <CreditCard size={18} />
                <span>Membership & Billing</span>
              </NavLink>
              <div className="mobile-drawer-divider" />
              <button type="button" className="mobile-nav-item logout-link" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

