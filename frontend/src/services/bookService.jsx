import { ENDPOINT } from "../config/endpoint";

const API_URL = `${ENDPOINT}/api/books`;


export const getDefaultBooksAPI = async (page = 1) => {
  const res = await fetch(`${API_URL}/default?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
};


export const searchBooksAPI = async (query, page = 1) => {
  const res = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(query)}&page=${page}`
  );
  if (!res.ok) throw new Error("Failed to search books");
  return res.json();
};


export const saveBookAPI = async (gutenId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/save/${gutenId}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!res.ok) throw new Error("Failed to save book");
  return res.json();
};


export const getBookByIdAPI = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!res.ok) throw new Error("Failed to load book");
  return res.json();
};
