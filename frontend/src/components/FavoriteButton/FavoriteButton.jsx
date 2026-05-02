import React, { useState } from "react";
import { useFavorites } from "../../context/FavoriteContext";
import { Heart } from "lucide-react";
import "./FavoriteButton.css";

function FavoriteButton({ book, getBookId, onStatusChange }) {
  const { favorites, toggleFavorite } = useFavorites();
  const [loading, setLoading] = useState(false);

  const bookId = book.id || book.bookId;

  const isFavorite = favorites.some(
    (f) => f.bookId === bookId
  );

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    try {

      const realId = bookId || (await getBookId());

      const result = await toggleFavorite(realId);

      onStatusChange && onStatusChange(result);
    } catch (e) {
      console.log("Favorite failed:", e);
      alert("Favorite failed. Try again.");
    }

    setLoading(false);
  }

  return (
    <button
      className={`bd-icon-btn heart-btn ${isFavorite ? "filled" : ""}`}
      onClick={handleClick}
    >
      <Heart
        size={22}
        strokeWidth={2.4}
        color={isFavorite ? "red" : "#555"}
        fill={isFavorite ? "red" : "none"}
      />
    </button>
  );
}

export default FavoriteButton;
