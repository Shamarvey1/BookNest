import React from "react";
import "./WritingSkeleton.css";

function WritingSkeleton() {
  return (
    <div className="skeleton-grid">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-card" />
      ))}
    </div>
  );
}

export default WritingSkeleton;

