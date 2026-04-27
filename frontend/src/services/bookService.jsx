import { ENDPOINT } from "../config/endpoint";

const API_URL = `${ENDPOINT}/api/books`;


export const getDefaultBooksAPI = async (page = 1) => {
  const res = await fetch(`${API_URL}/default?page=${page}`);
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to fetch books");
  }
  return result;
};


export const searchBooksAPI = async (query, page = 1) => {
  const res = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(query)}&page=${page}`
  );
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to search books");
  }
  return result;
};


export const saveBookAPI = async (gutenId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/save/${gutenId}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to save book");
  }
  return result;
};


export const getBookByIdAPI = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new Error("unauthorized");
    throw new Error(result?.msg || result?.message || "Failed to load book");
  }
  return result;
};
