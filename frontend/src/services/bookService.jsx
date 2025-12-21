
import { ENDPOINT } from "../config/endpoint";
const API_URL = `${ENDPOINT}/api/books`;

export const getBookMetaAPI = async (gutenId) => {
  const res = await fetch(`https://gutendex.com/books/${gutenId}`);
  if (!res.ok) throw new Error("Failed to fetch book meta");
  return res.json();
};

export const getDefaultBooksAPI = async () => {
  const res = await fetch(`${API_URL}/default`);
  return res.json();
};1

export const searchBooksAPI = async (query) => {
  const res = await fetch(`${API_URL}/search?q=${query}`);
  return res.json();
};

export const saveBookAPI = async (gutenId) => {
  const token = localStorage.getItem("token");

  console.log(API_URL,"API_URL in saveBookAPI");
  const res = await fetch(`${API_URL}/save/${gutenId}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return res.json();
};

export const getBookByIdAPI = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`,{
    headers: {
      Authorization: "Bearer " + token
    }
  });
  console.log(res,"res in getBookByIdAPI");

  return res.json();
};
