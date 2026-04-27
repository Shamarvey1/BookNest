import { ENDPOINT } from "../config/endpoint";
const API = `${ENDPOINT}/api`;

function auth() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
}

export async function upsertProgress(bookId, percent, position) {
  const res = await fetch(`${API}/progress`, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify({ bookId, percent, position }),
  });

  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to save progress");
  }

  return result;
}

export async function getProgress(bookId) {
  const res = await fetch(`${API}/progress/${bookId}`, {
    headers: auth(),
  });

  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    if (res.status === 404) return null;
    throw new Error(result?.msg || result?.message || "Failed to load progress");
  }

  return result;
}

export async function getAllProgress() {
  const res = await fetch(`${API}/progress`, {
    headers: auth(),
  });

  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to load progress");
  }

  return result;
}

export async function deleteProgress(bookId) {
  const res = await fetch(`${API}/progress/${bookId}`, {
    method: "DELETE",
    headers: auth(),
  });

  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to delete progress");
  }

  return result;
}
