import { ENDPOINT } from "../config/endpoint";
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

  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to load favorites");
  }

  return result;
}

export async function addFavorite(bookId) {
  const res = await fetch(`${API}/favorites`, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify({ bookId }),
  });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to add favorite");
  }

  return result;
}

export async function removeFavorite(bookId) {
  const res = await fetch(`${API}/favorites/${bookId}`, {
    method: "DELETE",
    headers: auth(),
  });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to remove favorite");
  }

  return result;
}
