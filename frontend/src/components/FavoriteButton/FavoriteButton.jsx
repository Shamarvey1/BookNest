import React, { useState } from "react";
import { useFavorites } from "../../context/FavoriteContext";
import { MdFavorite } from "react-icons/md";
import "./FavoriteButton.css";

function FavoriteButton({ book, getBookId, onStatusChange }) {
  const { favorites, toggleFavorite } = useFavorites();
  const [loading, setLoading] = useState(false);
  const [optimistic, setOptimistic] = useState(null);

  const bookId = book.id || book.bookId;

  const isFavorite = favorites.some(
    (f) => f.bookId === bookId
  );
  const displayState = optimistic !== null ? optimistic : isFavorite;

  async function handleClick() {
    if (loading) return;
    
    setOptimistic(!isFavorite);
    setLoading(true);

    try {
      const realId = bookId || (await getBookId());
      const result = await toggleFavorite(realId);
      onStatusChange && onStatusChange(result);
      setOptimistic(null);
    } catch (e) {
      setOptimistic(null);
      alert("Favorite failed. Try again.");
    }

    setLoading(false);
  }

  return (
    <button
      className={`bd-icon-btn heart-btn ${displayState ? "filled" : ""}`}
      onClick={handleClick}
    >
      <MdFavorite
        size={24}
        color={displayState ? "#2563eb" : "#555"}
      />
    </button>
  );
}

export default FavoriteButton;
