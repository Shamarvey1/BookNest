import { ENDPOINT } from "../config/endpoint";
const API = `${ENDPOINT}/api`;

function auth() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
}

export async function fetchBookmarks() {
  const res = await fetch(`${API}/bookmarks`, {
    headers: auth(),
  });

  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to load bookmarks");
  }

  return result;
}

export async function addBookmark(bookId) {
  const res = await fetch(`${API}/bookmarks`, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify({ bookId }),
  });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to add bookmark");
  }

  return result;
}

export async function removeBookmark(bookId) {
  const res = await fetch(`${API}/bookmarks/${bookId}`, {
    method: "DELETE",
    headers: auth(),
  });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to remove bookmark");
  }

  return result;
}
