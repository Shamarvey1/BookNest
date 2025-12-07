
import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchFavorites,
  addFavorite as apiAddFavorite,
  removeFavorite as apiRemoveFavorite,
} from "../services/favoriteService";

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    load();
  }, []);

  function normalizeFavorite(fav) {
    return {
      id: fav.id,
      bookId: fav.bookId || fav.book?.id || fav.book?._id,
      book: fav.book || null,
    };
  }

  async function load() {
    try {
      const data = await fetchFavorites();
      const normalized = data.map(normalizeFavorite);
      setFavorites(normalized);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
  }

  async function removeFavoriteItem(bookId) {
    try {
      await apiRemoveFavorite(bookId);

      setFavorites((prev) =>
        prev.filter((f) => f.bookId !== bookId)
      );
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  }

  async function toggleFavoriteItem(bookId) {
    const exists = favorites.some((f) => f.bookId === bookId);

    if (exists) {
      await removeFavoriteItem(bookId);
      return { status: "removed" };
    } else {
      try {
        const res = await apiAddFavorite(bookId);

        const newFav = normalizeFavorite(res);

        setFavorites((prev) => [...prev, newFav]);

        return { status: "added" };
      } catch (err) {
        console.error("Failed to add favorite:", err);
        throw err;
      }
    }
  }

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        toggleFavorite: toggleFavoriteItem,
        removeFavorite: removeFavoriteItem,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoriteContext);
}
