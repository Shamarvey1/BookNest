import React from "react";
import "./BookCardSkeleton.css";

const BookCardSkeleton = () => {
  return (
    <div className="book-card book-skeleton">
      <div className="skeleton-img shimmer"></div>

      <div className="skeleton-content">
        <div className="skeleton-line title shimmer"></div>
        <div className="skeleton-line author shimmer"></div>
      </div>
    </div>
  );
};

export default BookCardSkeleton;
