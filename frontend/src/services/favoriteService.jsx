import { ENDPOINT } from "../constants";
const API = `${ENDPOINT}/api`;

function auth() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
}

export async function fetchFavorites() {
  const res = await fetch(`${API}/favorites`, {
    headers: auth(),
  });

  if (!res.ok) {
    throw new Error("Failed to load favorites");
  }

  return res.json();
}

export async function addFavorite(bookId) {
  const res = await fetch(`${API}/favorites`, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify({ bookId }),
  });

  if (!res.ok) {
    throw new Error("Failed to add favorite");
  }

  return res.json();
}

export async function removeFavorite(bookId) {
  const res = await fetch(`${API}/favorites/${bookId}`, {
    method: "DELETE",
    headers: auth(),
  });

  if (!res.ok) {
    throw new Error("Failed to remove favorite");
  }

  return res.json();
}
