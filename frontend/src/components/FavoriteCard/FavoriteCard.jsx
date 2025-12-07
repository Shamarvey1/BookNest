import React from "react";
import "./FavoriteCard.css";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";

const FavoriteCard = ({ book }) => {
  const navigate = useNavigate();
  const { removeFavorite } = useFavorites();

  const handleRead = () => {
    navigate(`/reader/${book.id}`);
  };

  const handleRemove = () => {
    removeFavorite(book.id);
  };

  return (
    <div className="fav-card">
      <img
        src={book.coverUrl}
        alt={book.title}
        className="fav-card-cover"
      />
      <div className="fav-card-body">
        <h3 className="fav-card-title">{book.title}</h3>
        <p className="fav-card-authors">
          {Array.isArray(book.authors)
            ? book.authors.join(", ")
            : book.authors}
        </p>

        <div className="fav-card-actions">
          <button className="fav-read-btn" onClick={handleRead}>
            Read
          </button>
          <button className="fav-remove-btn" onClick={handleRemove}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
