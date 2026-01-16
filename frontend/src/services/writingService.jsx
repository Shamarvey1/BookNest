import { ENDPOINT } from "../config/endpoint";

const API = `${ENDPOINT}/api/writing`;

const auth = () => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + localStorage.getItem("token")
});

export const fetchMyBooks = async () => {
  const res = await fetch(API, { headers: auth() });
  return res.json();
};

export const fetchBookById = async (id) => {
  const res = await fetch(`${API}/${id}`, { headers: auth() });
  return res.json();
};

export const createBook = async (data) => {
  const res = await fetch(API, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const updateBook = async (id, data) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: auth(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteBook = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: auth()
  });
  return res.json();
};
