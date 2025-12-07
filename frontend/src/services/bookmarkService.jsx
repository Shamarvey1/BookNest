import { ENDPOINT } from "../constants";
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

  if (!res.ok) {
    throw new Error("Failed to load bookmarks");
  }

  return res.json();
}

export async function addBookmark(bookId) {
  const res = await fetch(`${API}/bookmarks`, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify({ bookId }),
  });

  if (!res.ok) {
    throw new Error("Failed to add bookmark");
  }

  return res.json();
}

export async function removeBookmark(bookId) {
  const res = await fetch(`${API}/bookmarks/${bookId}`, {
    method: "DELETE",
    headers: auth(),
  });

  if (!res.ok) {
    throw new Error("Failed to remove bookmark");
  }

  return res.json();
}
