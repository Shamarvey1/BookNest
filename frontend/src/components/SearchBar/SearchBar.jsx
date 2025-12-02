import React, { useRef } from "react";
import "./SearchBar.css";

const SearchBar = ({ query, setQuery, onSearch, onAutoSearch }) => {
  const debounceRef = useRef(null);

  const handleChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (text.trim() === "") {
        onAutoSearch([]);
        return;
      }
      onAutoSearch(text);
    },350);
  };

  return (
    <div className="search-box">
        <input type="text" placeholder="Search for books..." value={query}
        onChange={handleChange}/>
        <button onClick={onSearch}> Search </button>
    </div>
  );
};

export default SearchBar;
