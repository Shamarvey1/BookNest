import React from "react";
import "./SearchBar.css";

const SearchBar = () => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search books..."
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
