import React from "react";
import "./BookNestLoader.css";

function BookNestLoader({ text = "Loading your book..." }) {
  return (
    <div className="booknest-loader-wrapper">
      <div className="booknest-logo">
        Book<span>Nest</span>
      </div>

      <p className="booknest-loader-text">{text}</p>
    </div>
  );
}

export default BookNestLoader;
