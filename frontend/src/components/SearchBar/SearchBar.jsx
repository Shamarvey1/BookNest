import React, { useRef } from "react";
import "./SearchBar.css";

const SearchBar = ({ query, setQuery, onSearch, onAutoSearch }) => {
  const debounceRef = useRef(null);

//  Meaning of your sentence:
// “I have 350 ms to write new string or else it will call API after 350 ms.
// If I write a new string again, it clears previous timer and starts a new 350 ms.”
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
