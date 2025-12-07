import React from "react";
import "./Tabs.css";

function Tabs({ activeTab, onChange, bookmarksCount, favoritesCount }) {
  return (
    <div className="tabs-root">
      <button
        className={`tabs-item ${activeTab === "bookmarks" ? "tabs-item-active" : ""}`}
        onClick={() => onChange("bookmarks")}
      >
        <span className="tabs-icon">🔖</span>
        <span>Bookmarks</span>
        <span className="tabs-pill">{bookmarksCount}</span>
      </button>

      <button
        className={`tabs-item ${activeTab === "favorites" ? "tabs-item-active" : ""}`}
        onClick={() => onChange("favorites")}
      >
        <span className="tabs-icon">♥</span>
        <span>Favorites</span>
        <span className="tabs-pill">{favoritesCount}</span>
      </button>
    </div>
  );
}

export default Tabs;
